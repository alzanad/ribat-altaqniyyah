/**
 * سكريبت التطبيق الرئيسي لمبادرة رِباط التقنية
 * المسؤوليات: إدارة التفاعلية، التنقل، والتأثيرات البصرية
 * المبادئ المُتّبعة: Single Responsibility، DRY، Event Delegation
 */

(function() {
    'use strict';

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
        try {
            // تهيئة جميع الوحدات
            NavigationController.init();
            ChannelsController.init();
            VisualEffectsController.init();
            SmoothScrollController.init();
            PerformanceController.init();
            
            // تسجيل نجاح التهيئة (يمكن حذفه في الإنتاج)
            console.log('✅ تم تهيئة التطبيق بنجاح');
        } catch (error) {
            // التعامل مع الأخطاء بشكل آمن (Fail Fast & Safe)
            console.error('❌ خطأ في تهيئة التطبيق:', error);
        }
    }

    // الانتظار حتى اكتمال تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
