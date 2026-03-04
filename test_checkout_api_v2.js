import axios from 'axios';
const API_KEY = "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID = "218489";

async function test() {
    try {
        console.log(`Testing SellAuth Checkout API for Shop ${SHOP_ID}...`);
        const response = await axios.post(`https://api.sellauth.com/v1/shops/${SHOP_ID}/checkout`, {
            cart: [{ productId: 465176, variantId: 683033, quantity: 1 }]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("Error:", e.response?.data || e.message);
    }
}
test();
