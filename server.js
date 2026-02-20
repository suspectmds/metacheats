import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());

// SELLAUTH CONFIGURATION
const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY;
const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

// Balance Check Endpoint
app.get('/api/balance', (req, res) => {
    res.json({ balance: 240.25 });
});

// Products Proxy
app.get('/api/products', async (req, res) => {
    try {
        let allGroups = [];
        for (const shopId of SHOP_IDS) {
            const resp = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/groups`, {
                headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` }
            });
            allGroups = [...allGroups, ...(resp.data.data || [])];
        }
        res.json({ groups: allGroups });
    } catch (error) {
        console.error('SellAuth Local Proxy Error:', error.message);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Reviews Proxy
app.get('/api/reviews', async (req, res) => {
    try {
        let allReviews = [];
        for (const shopId of SHOP_IDS) {
            const resp = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/feedbacks`, {
                headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` }
            });
            const mapped = (resp.data.data || []).map(f => ({
                user: f.email ? f.email.split('@')[0] : "Verified User",
                date: new Date(f.created_at).toLocaleDateString(),
                rating: f.rating || 5,
                comment: f.comment || "No comment provided.",
                product: f.order?.product?.name || "Premium Product"
            }));
            allReviews = [...allReviews, ...mapped];
        }
        res.json({ reviews: allReviews });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// SellAuth Webhook Receiver
app.post('/api/webhook', (req, res) => {
    res.status(200).send('Webhook Received');
});

app.listen(PORT, () => {
    console.log(`MetaCheats Backend running on port ${PORT}`);
});
