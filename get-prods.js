import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const res = await axios.get(
            `https://api.sellauth.com/v1/shops/${process.env.SELLAUTH_SHOP_ID}/products`,
            {
                headers: { 'Authorization': `Bearer ${process.env.SELLAUTH_API_KEY}` }
            }
        );
        let products = res.data;
        if (res.data.data) products = res.data.data;

        for (let p of products) {
            if (p.variants && p.variants.length > 0) {
                console.log(`Found product: ${p.name} (ID: ${p.id})`);
                console.log(`  With variant: ${p.variants[0].id}`);
                return;
            }
        }
        console.log("No variants found.");
    } catch (err) {
        console.error('API Error:', err.response?.data || err.message);
    }
}
test();
