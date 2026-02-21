import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const res = await axios.post(
            `https://api.sellauth.com/v1/shops/${process.env.SELLAUTH_SHOP_ID}/checkout`,
            {
                cart: [
                    {
                        productId: 726554,
                        variantId: 977033,
                        quantity: 1
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.SELLAUTH_API_KEY}`,
                    'Accept': 'application/json'
                }
            }
        );
        console.log('Success:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('API Error:', err.response.data);
        } else {
            console.error('Request Error:', err.message);
        }
    }
}
test();
