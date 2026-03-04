import axios from 'axios';
const API_KEY = "5555320|TN3mUsZ8TB4ESf5JrN5ovQEtunDOR4ykLoePdu2f2629f464";
const SHOP_ID = "218489";

async function test() {
    try {
        console.log(`Testing SellAuth Checkout API with Key 5555320...`);
        // We don't know the product IDs for this shop yet, so let's just try to list them first
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        console.log("Status:", response.status);
        if (response.data.data && response.data.data.length > 0) {
            const p = response.data.data[0];
            const v = p.variants[0];
            console.log(`Trying checkout for Product ${p.id}, Variant ${v.id}...`);
            const checkoutRes = await axios.post(`https://api.sellauth.com/v1/shops/${SHOP_ID}/checkout`, {
                cart: [{ productId: p.id, variantId: v.id, quantity: 1 }]
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log("Checkout Data:", JSON.stringify(checkoutRes.data, null, 2));
        } else {
            console.log("No products found in this shop.");
        }
    } catch (e) {
        console.error("Error:", e.response?.data || e.message);
    }
}
test();
