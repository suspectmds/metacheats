const fs = require('fs');
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
};

const getProductDescription = (product, fullData = {}) => {
    const d1 = product.description;
    const d2 = fullData.description;
    const desc = d2 || d1;
    if (desc && stripHtml(desc).length > 2) return stripHtml(desc);

    const variants = fullData.variants || product.variants || [];
    for (const v of variants) {
        if (v.description && stripHtml(v.description).length > 2) {
            return stripHtml(v.description);
        }
    }
    return '';
};

try {
    const cache = JSON.parse(fs.readFileSync('.sellauth_cache.json', 'utf8'));
    const products = cache.data.products;

    console.log('--- Verification Results ---');
    products.forEach(p => {
        const desc = getProductDescription(p);
        if (desc) {
            console.log(`[OK] ${p.name}: ${desc.substring(0, 60)}...`);
        } else {
            console.log(`[WARN] ${p.name}: NO DESCRIPTION FOUND`);
        }
    });
} catch (err) {
    console.error('SCRIPT ERROR:', err.message);
    console.error(err.stack);
}

