/**
 * generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * مولّد Sitemap ديناميكي
 * يقرأ بيانات القنوات والسيو ويُنتج sitemap.xml محدّث
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

// مسارات الملفات
const ROOT_DIR = path.join(__dirname, '..');
const SEO_CONFIG_PATH = path.join(ROOT_DIR, 'assets', 'js', 'seo-config.js');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

/**
 * تحميل إعدادات السيو
 */
function loadSeoConfig() {
    const configContent = fs.readFileSync(SEO_CONFIG_PATH, 'utf8');
    
    // استخراج SEO_CONFIG من الملف
    const configMatch = configContent.match(/const SEO_CONFIG = ({[\s\S]*?});/);
    if (!configMatch) {
        throw new Error('❌ لم يُعثر على SEO_CONFIG في الملف');
    }
    
    // تقييم الكائن (آمن لأنه ملف محلي موثوق)
    return eval('(' + configMatch[1] + ')');
}

/**
 * توليد محتوى sitemap.xml
 */
function generateSitemapXML(config) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    config.sections.forEach(section => {
        const loc = `${config.site.url}${section.path}`;
        xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${section.changefreq}</changefreq>
    <priority>${section.priority}</priority>`;
        
        if (section.id === 'home') {
            xml += `
    <xhtml:link rel="alternate" hreflang="${config.site.language}" href="${loc}"/>`;
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
 * نقطة الدخول الرئيسية
 */
function main() {    
    try {
        // تحميل الإعدادات
        const config = loadSeoConfig();
        
        // توليد XML
        const sitemapContent = generateSitemapXML(config);
        
        // كتابة الملف
        fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
        
    } catch (error) {
        process.exit(1);
    }
}

main();
