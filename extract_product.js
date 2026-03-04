import fs from 'fs';

const data = JSON.parse(fs.readFileSync('full_products.json', 'utf8'));
const products = data.data || data.products || [];
const target = products.find(p => p.id === 619348 || String(p.id) === '619348');

if (target) {
    console.log('Product:', target.name);
    console.log('Product instructions:', target.instructions);
    target.variants.forEach((v, i) => {
        console.log(`Variant ${i} (${v.name}) instructions:`, v.instructions);
    });
} else {
    console.log('Product not found');
}
