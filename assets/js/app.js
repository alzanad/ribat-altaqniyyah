/**
 * سكريبت التطبيق الرئيسي لمبادرة رِباط التقنية
 * المسؤوليات: إدارة التفاعلية، التنقل، السيو الديناميكي، وعرض بيانات القنوات
 * المبادئ المُتّبعة: Single Responsibility، DRY، Event Delegation
 */

(function() {
    'use strict';

    /**
     * وحدة السيو الديناميكي (Dynamic SEO Module)
     * المسؤولية: توليد وحقن بيانات JSON-LD من الإعدادات المركزية
     */
    const DynamicSEO = {
        init() {
            if (typeof SEO_CONFIG === 'undefined' || typeof CHANNELS_DATA === 'undefined') {
                return;
            }
            
            this.injectSchemaMarkup();
        },

        injectSchemaMarkup() {
            const schemas = this.generateSchemas();
            
            // حقن كل Schema في عنصره المخصص
            const schemaElements = {
                'schema-organization': schemas[0],
                'schema-website': schemas[1],
                'schema-itemlist': schemas[2]
            };

            Object.entries(schemaElements).forEach(([id, schema]) => {
                const element = document.getElementById(id);
                if (element && schema) {
                    element.textContent = JSON.stringify(schema, null, 2);
                }
            });
        },

        generateSchemas() {
            const config = SEO_CONFIG;
            const channels = CHANNELS_DATA.channels || [];
            const schemas = [];

            // 1. Organization Schema
            schemas.push({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': config.organization.name,
                'alternateName': config.organization.nameEn,
                'url': config.site.url,
                'logo': config.site.logo,
                'description': config.meta.description,
                'foundingDate': config.organization.foundingDate,
                'sameAs': config.organization.sameAs,
                'contactPoint': {
                    '@type': 'ContactPoint',
                    'contactType': 'customer service',
                    'url': config.organization.contactUrl,
                    'availableLanguage': 'Arabic'
                }
            });

            // 2. WebSite Schema
            schemas.push({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'name': config.site.name,
                'alternateName': config.site.nameEn,
                'url': config.site.url,
                'description': config.meta.description,
                'inLanguage': config.site.language,
                'publisher': {
                    '@type': 'Organization',
                    'name': config.organization.name
                }
            });

            // 3. ItemList Schema (قائمة القنوات)
            if (channels.length > 0) {
                const itemListElements = channels.map((channel, index) => ({
                    '@type': 'ListItem',
                    'position': index + 1,
                    'item': {
                        '@type': 'Organization',
                        'name': channel.name,
                        'url': channel.url,
                        'description': channel.description
                    }
                }));

                schemas.push({
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    'name': 'أفضل القنوات التقنية العربية على تليغرام',
                    'description': 'قائمة مختارة بعناية تضم أفضل القنوات التقنية العربية الملتزمة',
                    'numberOfItems': channels.length,
                    'itemListElement': itemListElements
                });
            }

            return schemas;
        }
    };

    /**
     * وحدة عرض القنوات (Channels Renderer Module)
     * المسؤولية: توليد بطاقات القنوات من البيانات المضمنة في channels-data.js
     */
    const ChannelsRenderer = {
        init() {
            this.channelsList = document.querySelector('.channels-list');
            this.specialLinkContainer = document.querySelector('.special-link-container');
            
            if (!this.channelsList) return;

            // التحقق من وجود البيانات
            if (typeof CHANNELS_DATA === 'undefined') {
                return;
            }

            this.updateSpecialLink();
            this.renderChannels();
        },

        updateSpecialLink() {
            if (!this.specialLinkContainer || !CHANNELS_DATA.addAllLink) return;
            
            const link = this.specialLinkContainer.querySelector('.special-link');
            if (link) link.href = CHANNELS_DATA.addAllLink;
        },

        renderChannels() {
            const channels = CHANNELS_DATA.channels;
            
            if (!channels || !channels.length) {
                this.channelsList.innerHTML = '<li class="no-channels">لا توجد قنوات متاحة حالياً</li>';
                return;
            }

            this.channelsList.innerHTML = channels.map(channel => this.createChannelCard(channel)).join('');
        },

        createChannelCard(channel) {
            // تحويل \n إلى <br> للأوصاف متعددة الأسطر
            const formattedDescription = channel.description.replace(/\n/g, '<br>');
            
            return `
                <li class="channel-card">
                    <div class="channel-header">
                        <a href="${channel.url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="channel-link">
                            ${channel.name}
                        </a>
                        <button class="toggle-btn" 
                                aria-label="إظهار الوصف"
                                aria-expanded="false">
                            +
                        </button>
                    </div>
                    <div class="channel-description">
                        <p>${formattedDescription}</p>
                    </div>
                </li>
            `;
        }
    };

    /**
     * وحدة إدارة التنقل (Navigation Module)
     * المسؤولية: التحكم في شريط التنقل وقائمة الجوال
     */
    const NavigationController = {
        init() {
            this.hamburger = document.querySelector('.hamburger');
            this.navMenu = document.querySelector('.nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            
            if (this.hamburger && this.navMenu) {
                this.bindEvents();
            }
        },

        bindEvents() {
            // فتح/إغلاق القائمة في الجوال
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            
            // إغلاق القائمة عند النقر على رابط
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar') && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
        },

        toggleMenu() {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        },

        closeMenu() {
            this.navMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
        }
    };

    /**
     * وحدة إدارة القنوات (Channels Module)
     * المسؤولية: التحكم في توسيع/طي أوصاف القنوات
     */
    const ChannelsController = {
        init() {
            this.channelsList = document.querySelector('.channels-list');
            
            if (this.channelsList) {
                this.bindEvents();
            }
        },

        bindEvents() {
            // استخدام Event Delegation لتحسين الأداء
            this.channelsList.addEventListener('click', (e) => {
                const header = e.target.closest('.channel-header');
                if (header) {
                    this.toggleDescription(header);
                }
            });
        },

        toggleDescription(header) {
            const description = header.nextElementSibling;
            const toggleBtn = header.querySelector('.toggle-btn');
            
            if (description && toggleBtn) {
                const isActive = description.classList.toggle('active');
                
                // تحديث نص ووسم الزر
                toggleBtn.textContent = isActive ? '−' : '+';
                toggleBtn.setAttribute('aria-label', isActive ? 'إخفاء الوصف' : 'إظهار الوصف');
                toggleBtn.setAttribute('aria-expanded', isActive);
            }
        }
    };

    /**
     * وحدة التأثيرات البصرية (Visual Effects Module)
     * المسؤولية: إدارة الرسوم المتحركة والتأثيرات عند التمرير
     */
    const VisualEffectsController = {
        init() {
            this.observeElements();
            this.enhanceAccessibility();
        },

        observeElements() {
            // استخدام Intersection Observer للرسوم المتحركة عند الظهور
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // مراقبة العناصر التي تحتاج رسوم متحركة
            const animatedElements = document.querySelectorAll('.channel-card, .condition-item, .about-section');
            animatedElements.forEach(el => observer.observe(el));
        },

        enhanceAccessibility() {
            // إضافة دعم لوحة المفاتيح للأزرار القابلة للتوسيع
            const toggleButtons = document.querySelectorAll('.toggle-btn');
            toggleButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });
        }
    };

    /**
     * وحدة التمرير السلس (Smooth Scroll Module)
     * المسؤولية: تحسين تجربة التنقل بين الأقسام
     */
    const SmoothScrollController = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    
                    // تجاهل الروابط الفارغة
                    if (href === '#' || href === '#!') {
                        e.preventDefault();
                        return;
                    }

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // تحديث رابط المتصفح
                        history.pushState(null, '', href);
                    }
                });
            });
        }
    };

    /**
     * وحدة إدارة الأداء (Performance Module)
     * المسؤولية: تحسين الأداء وتقليل استهلاك الموارد
     */
    const PerformanceController = {
        init() {
            this.debounce = this.debounce.bind(this);
            this.optimizeImages();
        },

        /**
         * تقنية Debounce لتحسين الأداء في الأحداث المتكررة
         * @param {Function} func - الدالة المراد تنفيذها
         * @param {number} wait - وقت الانتظار بالملي ثانية
         * @returns {Function}
         */
        debounce(func, wait = 300) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        optimizeImages() {
            // تحميل الصور بكسل (Lazy Loading) إذا لزم الأمر
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    };

    /**
     * نقطة الدخول الرئيسية للتطبيق
     * تُنفَّذ عند اكتمال تحميل DOM
     */
    function initializeApp() {
        // توليد السيو الديناميكي أولاً
        DynamicSEO.init();
        
        // عرض القنوات من البيانات المضمنة
        ChannelsRenderer.init();
        
        // تهيئة باقي الوحدات
        NavigationController.init();
        ChannelsController.init();
        VisualEffectsController.init();
        SmoothScrollController.init();
        PerformanceController.init();
    }

    // الانتظار حتى اكتمال تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
