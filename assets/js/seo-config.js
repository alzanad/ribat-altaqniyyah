/**
 * seo-config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * المصدر المركزي لبيانات السيو والموقع
 * يُغذّي: sitemap.xml، JSON-LD، meta tags، manifest.json
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SEO_CONFIG = {
    // البيانات الأساسية للموقع
    site: {
        name: 'رِباط التقنية',
        nameEn: 'Ribat Al-Taqniyyah',
        shortName: 'رِباط',
        url: 'https://alzanad.github.io/ribat-altaqniyyah/',
        logo: 'https://i.ibb.co/WNwSnQKM/photo-2025-08-04-19-43-23.jpg',
        language: 'ar',
        locale: 'ar_AR',
        direction: 'rtl',
        themeColor: '#c9a227', // اللون الذهبي الجديد
        backgroundColor: '#1a1a1a'
    },

    // البيانات الوصفية للسيو
    meta: {
        title: 'رِباط التقنية | أفضل القنوات التقنية العربية على تليغرام 2025',
        description: 'اكتشف أفضل القنوات التقنية العربية الملتزمة على تليغرام. دليل شامل يضم 12+ قناة متخصصة في البرمجة، تطوير الويب، الذكاء الاصطناعي، والأمن السيبراني. محتوى عربي حصري ومجاني.',
        keywords: [
            'قنوات تليغرام تقنية',
            'قنوات برمجة عربية',
            'تعلم البرمجة مجانا',
            'قنوات تقنية عربية',
            'telegram tech channels',
            'قنوات تعليم البرمجة',
            'مطورين عرب',
            'قنوات أمن سيبراني',
            'تطوير ويب عربي',
            'قنوات ذكاء اصطناعي',
            'محتوى تقني عربي',
            'برمجة بالعربي'
        ],
        author: 'مبادرة رِباط التقنية',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    },

    // بيانات المنظمة (Organization)
    organization: {
        name: 'مبادرة رِباط التقنية',
        nameEn: 'Ribat Al-Taqniyyah Initiative',
        foundingDate: '2024',
        contactUrl: 'https://t.me/alzaanad',
        sameAs: ['https://t.me/alzaanad']
    },

    // أقسام الموقع للـ Sitemap
    sections: [
        {
            id: 'home',
            path: '',
            priority: 1.0,
            changefreq: 'weekly',
            title: 'الرئيسية'
        },
        {
            id: 'channels',
            path: '#channels',
            priority: 0.9,
            changefreq: 'weekly',
            title: 'قائمة القنوات التقنية'
        },
        {
            id: 'conditions',
            path: '#conditions',
            priority: 0.7,
            changefreq: 'monthly',
            title: 'شروط الانضمام'
        },
        {
            id: 'about',
            path: '#about',
            priority: 0.6,
            changefreq: 'monthly',
            title: 'عن المبادرة'
        },
        {
            id: 'contact',
            path: '#contact',
            priority: 0.5,
            changefreq: 'monthly',
            title: 'اتصل بنا'
        }
    ],

    // بيانات Open Graph
    openGraph: {
        type: 'website',
        imageWidth: 1200,
        imageHeight: 630,
        imageAlt: 'شعار مبادرة رباط التقنية'
    },

    // بيانات Twitter Card
    twitter: {
        card: 'summary_large_image',
        imageAlt: 'شعار مبادرة رباط التقنية'
    },

    // بيانات الموقع الجغرافي
    geo: {
        region: 'SA',
        placeName: 'Saudi Arabia'
    }
};

/**
 * توليد بيانات JSON-LD الكاملة
 * @param {Array} channels - مصفوفة القنوات من CHANNELS_DATA
 * @returns {Array} - مصفوفة كائنات JSON-LD
 */
function generateSchemaMarkup(channels = []) {
    const schemas = [];

    // 1. Organization Schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': SEO_CONFIG.organization.name,
        'alternateName': SEO_CONFIG.organization.nameEn,
        'url': SEO_CONFIG.site.url,
        'logo': SEO_CONFIG.site.logo,
        'description': SEO_CONFIG.meta.description,
        'foundingDate': SEO_CONFIG.organization.foundingDate,
        'sameAs': SEO_CONFIG.organization.sameAs,
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer service',
            'url': SEO_CONFIG.organization.contactUrl,
            'availableLanguage': 'Arabic'
        }
    });

    // 2. WebSite Schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SEO_CONFIG.site.name,
        'alternateName': SEO_CONFIG.site.nameEn,
        'url': SEO_CONFIG.site.url,
        'description': SEO_CONFIG.meta.description,
        'inLanguage': SEO_CONFIG.site.language,
        'publisher': {
            '@type': 'Organization',
            'name': SEO_CONFIG.organization.name
        }
    });

    // 3. ItemList Schema (قائمة القنوات)
    if (channels && channels.length > 0) {
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

/**
 * توليد محتوى sitemap.xml
 * @param {Array} channels - مصفوفة القنوات (اختياري)
 * @returns {string} - محتوى XML
 */
function generateSitemapXML(channels = []) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // إضافة أقسام الموقع
    SEO_CONFIG.sections.forEach(section => {
        const loc = `${SEO_CONFIG.site.url}${section.path}`;
        xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${section.changefreq}</changefreq>
    <priority>${section.priority}</priority>`;
        
        // إضافة hreflang للصفحة الرئيسية فقط
        if (section.id === 'home') {
            xml += `
    <xhtml:link rel="alternate" hreflang="${SEO_CONFIG.site.language}" href="${loc}"/>`;
        }
        
        xml += `
  </url>
`;
    });

    xml += `</urlset>
`;

    return xml;
}

/**
 * توليد محتوى manifest.json
 * @returns {Object} - كائن Manifest
 */
function generateManifest() {
    return {
        name: SEO_CONFIG.site.name,
        short_name: SEO_CONFIG.site.shortName,
        description: SEO_CONFIG.meta.description,
        start_url: '/ribat-altaqniyyah/',
        display: 'standalone',
        background_color: SEO_CONFIG.site.backgroundColor,
        theme_color: SEO_CONFIG.site.themeColor,
        orientation: 'portrait-primary',
        lang: SEO_CONFIG.site.language,
        dir: SEO_CONFIG.site.direction,
        icons: [
            {
                src: SEO_CONFIG.site.logo,
                sizes: '192x192',
                type: 'image/jpeg'
            },
            {
                src: SEO_CONFIG.site.logo,
                sizes: '512x512',
                type: 'image/jpeg'
            }
        ],
        categories: ['education', 'technology']
    };
}

// تصدير للاستخدام في المتصفح والـ Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEO_CONFIG, generateSchemaMarkup, generateSitemapXML, generateManifest };
} else if (typeof window !== 'undefined') {
    window.SEO_CONFIG = SEO_CONFIG;
    window.generateSchemaMarkup = generateSchemaMarkup;
    window.generateSitemapXML = generateSitemapXML;
    window.generateManifest = generateManifest;
}
