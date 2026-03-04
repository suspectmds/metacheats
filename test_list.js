import axios from 'axios';

const API_KEY = "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID = "169969";

async function test() {
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products?per_page=1`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const products = response.data.data || response.data.products || [];
        if (products.length > 0) {
            const p = products[0];
            console.log('Product Name:', p.name);
            console.log('Product Description:', p.description);

            console.log('Variants Count:', p.variants?.length);
            p.variants?.slice(0, 3).forEach((v, i) => {
                console.log(`Variant ${i}: name="${v.name}", price="${v.price}"`);
            });
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
