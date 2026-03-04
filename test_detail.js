import axios from 'axios';

const API_KEY = "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID = "169969";
const PRODUCT_ID = "631780"; // Ignite - Apex Legends

async function test() {
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products/${PRODUCT_ID}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const product = response.data;
        console.log('Product Name:', product.name);
        console.log('--- Product Fields ---');
        console.log('description:', product.description);
        console.log('short_description:', product.short_description);
        console.log('instructions:', product.instructions);
        console.log('body:', product.body);
        console.log('content:', product.content);

        console.log('--- Variant 0 Fields ---');
        if (product.variants?.[0]) {
            const v = product.variants[0];
            console.log('name:', v.name);
            console.log('description:', v.description);
            console.log('instructions:', v.instructions);
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
