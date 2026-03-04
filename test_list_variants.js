import axios from 'axios';

const API_KEY = "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID = "169969";

async function test() {
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const products = response.data.data || response.data.products || [];
        const vega = products.find(p => p.id === 465176 || String(p.id) === '465176');
        if (vega) {
            vega.variants.forEach((v, i) => {
                console.log(`Variant ${i} keys:`, Object.keys(v));
                console.log(`Variant ${i} name: "${v.name}"`);
            });
        } else {
            console.log('Vega not found in list');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
