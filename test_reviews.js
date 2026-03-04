import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SELLAUTH_API_KEY;
const SHOP_ID = '169969';

async function test() {
    console.log(`Testing reviews for Shop ID: ${SHOP_ID}`);
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const data = response.data;
        console.log('API_KEYS:', Object.keys(data));
        const feedbacks = data.data || [];
        console.log('DATA_LENGTH:', feedbacks.length);
        if (feedbacks.length > 0) {
            const f = feedbacks[0];
            console.log('ITEM_0_ID:', f.id);
            console.log('ITEM_0_COMMENT:', f.message || f.comment || f.feedback || f.review || "NONE");
            console.log('ITEM_0_RATING:', f.rating);
            console.log('ITEM_0_HAS_INVOICE:', !!f.invoice);
        }
        console.log('--- END TEST ---');
    } catch (error) {
        console.error('Error fetching reviews:', error.response ? error.response.data : error.message);
    }
}

test();
