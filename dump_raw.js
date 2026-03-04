import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID = "169969";

async function dump() {
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        fs.writeFileSync('raw_reviews.json', JSON.stringify(response.data, null, 2));
        console.log('Dumped raw_reviews.json');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

dump();
