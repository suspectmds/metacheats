import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SELLAUTH_API_KEY;
const SHOP_ID = process.env.SELLAUTH_SHOP_ID;

async function verify() {
    console.log(`Verifying reviews for Shop ID: ${SHOP_ID}`);
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        const feedbacks = response.data.data || [];
        console.log('Total raw reviews from API:', feedbacks.length);

        const mapped = feedbacks.map(f => ({
            user: f.invoice?.email ? f.invoice.email.split('@')[0] : (f.email ? f.email.split('@')[0] : "Verified Customer"),
            rating: f.rating || 5,
            comment: f.message || f.comment || f.feedback || f.review || "Premium service, highly recommend!",
            created_at: f.created_at
        }));

        console.log('Total mapped reviews:', mapped.length);
        if (mapped.length > 0) {
            console.log('First mapped review sample:', JSON.stringify(mapped[0], null, 2));
            console.log('Last mapped review sample:', JSON.stringify(mapped[mapped.length - 1], null, 2));
        }

    } catch (error) {
        console.error('Verification error:', error.response ? error.response.data : error.message);
    }
}

verify();
