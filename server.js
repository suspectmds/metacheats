import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// File-based cache for simplicity in local dev
const CACHE_FILE = path.join(__dirname, '.sellauth_cache.json');
const CACHE_DURATION = 300000; // 5 Minutes

function getCachedData() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            return data;
        }
    } catch (e) { }
    return null;
}

function setCachedData(data) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) { }
}

app.get('/api/products', async (req, res) => {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (!API_KEY || SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "Missing config" });
    }

    const now = Date.now();
    const cached = getCachedData();
    if (cached && (now - cached.timestamp < CACHE_DURATION) && req.query?.refresh !== 'true') {
        console.log('[CACHE] Returning cached products (Server)');
        return res.json({ ...cached.data, cached: true });
    }

    console.log('[SYNC] Starting high-fidelity sync (Server)...');
    let allGroups = [];
    let allProductsFlat = [];

    try {
        for (const shopId of SHOP_IDS) {
            console.log(`[SYNC] Fetching Shop ${shopId}...`);
            const [gRes, pRes] = await Promise.all([
                axios.get(`https://api.sellauth.com/v1/shops/${shopId}/groups`, {
                    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                }),
                axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products?per_page=100`, {
                    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                })
            ]);

            const shopGroups = gRes.data.data || gRes.data.groups || [];
            const shopProducts = pRes.data.data || pRes.data.products || [];

            // Deep Sync: Detect missing IDs from groups not in main list
            const existingIds = new Set(shopProducts.map(p => p.id));
            const missingIds = [];
            shopGroups.forEach(g => {
                (g.products || []).forEach(gp => {
                    if (!existingIds.has(gp.id)) {
                        missingIds.push(gp.id);
                        existingIds.add(gp.id);
                    }
                });
            });

            if (missingIds.length > 0) {
                console.log(`[SYNC] Deep sync: Fetching ${missingIds.length} missing products...`);
                for (const id of missingIds) {
                    try {
                        const detail = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${id}`, {
                            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                        });
                        if (detail.data) shopProducts.push(detail.data);
                    } catch (e) { console.error(`Failed to fetch ${id}:`, e.message); }
                }
            }

            allGroups.push(...shopGroups);
            allProductsFlat.push(...shopProducts);
        }

        // Merge groups by name
        const mergedMap = new Map();
        allGroups.forEach(g => {
            const name = g.name.trim();
            if (mergedMap.has(name)) {
                const existing = mergedMap.get(name);
                existing.mergedIds = existing.mergedIds || [existing.id];
                existing.mergedIds.push(g.id);
                const combined = [...(existing.products || []), ...(g.products || [])];
                const seen = new Set();
                existing.products = combined.filter(p => {
                    if (seen.has(p.id)) return false;
                    seen.add(p.id);
                    return true;
                });
            } else {
                mergedMap.set(name, { ...g, mergedIds: [g.id] });
            }
        });

        const finalGroups = Array.from(mergedMap.values());
        const finalData = { groups: finalGroups, products: allProductsFlat };

        setCachedData(finalData);
        console.log(`[SYNC] Success. Cached ${finalGroups.length} groups.`);
        res.json(finalData);

    } catch (error) {
        console.error('Server sync error:', error.message);
        if (cached) return res.json(cached.data);
        res.status(500).json({ error: "Failed to sync" });
    }
});

// High-fidelity Product Detail Handler
app.get('/api/product-detail/:id', async (req, res) => {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID = (process.env.SELLAUTH_SHOP_ID || '').split(',')[0].trim();
    const productId = req.params.id;

    if (!API_KEY || !SHOP_ID) {
        return res.status(500).json({ error: "Missing config" });
    }

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
            timeout: 10000
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Detail Handler Error (${productId}):`, error.message);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
});

app.get('/api/reviews', async (req, res) => {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID = (process.env.SELLAUTH_SHOP_ID || '').split(',')[0].trim();
    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        const feedbacks = response.data.data || [];

        // Use high-fidelity mapping to ensure all comment/user variants are caught
        const mapped = feedbacks.map(f => {
            const product = f.invoice?.items?.[0]?.product?.name || f.order?.product?.name || f.product?.name;
            const hasRealMessage = f.message && f.message.trim().length > 0;

            return {
                user: f.invoice?.email ? f.invoice.email.split('@')[0] : (f.email ? f.email.split('@')[0] : "Verified Customer"),
                rating: f.rating || 5,
                comment: hasRealMessage ? f.message : (product ? `Verified purchase: ${product}` : "Premium service, highly recommend!"),
                created_at: f.created_at,
                is_automatic: f.is_automatic
            };
        });

        res.json({ reviews: mapped });
    } catch (e) {
        console.error('Local server reviews error:', e.message);
        res.status(500).json({ reviews: [] });
    }
});

app.post('/api/checkout', async (req, res) => {
    const { productId, variantId } = req.body;
    if (!productId || !variantId) return res.status(400).json({ error: "Missing product or variant ID" });

    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "No shops configured" });
    }

    let lastError = null;

    // Try each shop until success or we run out
    for (const shopId of SHOP_IDS) {
        try {
            console.log(`[CHECKOUT] Attempting session for Shop ${shopId}...`);
            const response = await axios.post(`https://api.sellauth.com/v1/shops/${shopId}/checkout`, {
                cart: [{ productId: Number(productId), variantId: Number(variantId), quantity: 1 }]
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 5000
            });

            const data = response.data.data || response.data;
            const checkoutUrl = data.url || data.checkout_url || data.redirect_url;

            if (checkoutUrl) {
                console.log(`[CHECKOUT] Success on Shop ${shopId}: ${checkoutUrl}`);
                return res.json({ url: checkoutUrl });
            }
        } catch (e) {
            lastError = e.response?.data || e.message;
            console.warn(`[CHECKOUT] Trial on Shop ${shopId} failed:`, lastError);
        }
    }

    console.error('[CHECKOUT] All shops failed:', lastError);
    res.status(500).json({ error: "Failed to create checkout session across all shops", details: lastError });
});

app.listen(PORT, () => {
    console.log(`MetaCheats Backend running on port ${PORT}`);
});
