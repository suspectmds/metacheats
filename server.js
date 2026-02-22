import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());

// SELLAUTH CONFIGURATION
const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY;
const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

// Persistent File Cache Configuration
const CACHE_FILE = path.join(process.cwd(), '.sellauth_cache.json');
const CACHE_DURATION = 3600000; // 1 Hour - CRITICAL: Respecting SellAuth Rate Limits

const getCachedData = () => {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const content = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(content);
        }
    } catch (e) { console.error('Cache Read Error:', e.message); }
    return null;
};

const setCachedData = (data) => {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify({ data, timestamp: Date.now() }), 'utf-8');
    } catch (e) { console.error('Cache Write Error:', e.message); }
};

// Balance Check Endpoint
app.get('/api/balance', (req, res) => {
    res.json({ balance: 240.25 });
});

// Products Proxy
app.get('/api/products', async (req, res) => {
    try {
        const cached = getCachedData();
        const now = Date.now();

        if (cached && (now - cached.timestamp < CACHE_DURATION)) {
            return res.json({ groups: cached.data });
        }

        let allGroups = [];
        for (const shopId of SHOP_IDS) {
            console.log(`[SYNC] Starting fetch for Shop ${shopId}`);

            const gRes = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/groups`, {
                headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` },
                timeout: 10000
            });
            const groups = gRes.data.data || [];

            const pRes = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products?per_page=100`, {
                headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` },
                timeout: 10000
            });
            const productsShort = pRes.data.data || [];

            console.log(`[SYNC] Fetching details for ${productsShort.length} products...`);
            const detailedProducts = [];
            for (const p of productsShort) {
                try {
                    const detailRes = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${p.id}`, {
                        headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` },
                        timeout: 10000
                    });
                    const fullP = detailRes.data;
                    detailedProducts.push(fullP);
                    await new Promise(r => setTimeout(r, 600)); // Rate limit safety
                } catch (e) {
                    console.error(`[SYNC] Failed ${p.id}: ${e.message}`);
                    detailedProducts.push(p);
                }
            }

            groups.forEach(group => {
                group.products = detailedProducts.filter(p => String(p.group_id) === String(group.id));
            });

            allGroups = [...allGroups, ...groups];
        }

        if (allGroups.length > 0) {
            console.log(`[SYNC] Success. Caching ${allGroups.length} groups.`);
            setCachedData(allGroups);
        }
        res.json({ groups: allGroups });
    } catch (error) {
        console.error('[SYNC] Global Error:', error.message);
        const cached = getCachedData();
        if (cached && cached.data) {
            return res.json({ groups: cached.data, isStale: true });
        }

        res.status(429).json({ error: "Rate limit active." });
    }
});

// Specific Product Proxy (for Variants/Descriptions)
app.get('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        // Search through shop IDs for the product (using the first one for now as it's typically a 1:1 map in config)
        const shopId = SHOP_IDS[0];

        const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${SELLAUTH_API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error(`SellAuth Product [${req.params.productId}] Fetch Error:`, error.message);
        res.status(500).json({ error: "Failed to fetch product details" });
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

// Checkout Proxy (Local Development)
app.post('/api/checkout', async (req, res) => {
    try {
        const { productId, variantId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const shopId = SHOP_IDS[0];
        const payload = {
            cart: [
                {
                    productId: productId,
                    quantity: 1
                }
            ]
        };

        if (variantId) {
            payload.cart[0].variantId = variantId;
        }

        const response = await axios.post(
            `https://api.sellauth.com/v1/shops/${shopId}/checkout`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.url) {
            res.json({ url: response.data.url });
        } else {
            res.status(500).json({ error: 'Failed to generate checkout URL', details: response.data });
        }
    } catch (error) {
        console.error('Checkout Local API Error:', error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

// SellAuth Webhook Receiver
app.post('/api/webhook', (req, res) => {
    res.status(200).send('Webhook Received');
});

app.listen(PORT, () => {
    console.log(`MetaCheats Backend running on port ${PORT}`);
});
