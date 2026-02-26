import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const shopId = process.env.SELLAUTH_SHOP_ID;
    const apiKey = process.env.SELLAUTH_API_KEY;

    try {
        const gRes = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products?per_page=1`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const product = gRes.data.data[0];
        console.log('Testing with product:', product.id, product.name);

        const payload = {
            cart: [
                {
                    productId: product.id,
                    quantity: 1
                }
            ]
        };

        const res = await axios.post(`https://api.sellauth.com/v1/shops/${shopId}/checkout`, payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Checkout Success:', res.data);
    } catch (e) {
        console.error('Checkout Error:', e.response?.data || e.message);
    }
}
run();
