import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// File-based cache for simplicity in local dev
const CACHE_FILE = path.join(__dirname, '.sellauth_cache.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const CACHE_DURATION = 300000; // 5 Minutes
const JWT_SECRET = process.env.JWT_SECRET || 'metacheats-premium-security-2026';

function getUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
    } catch (e) { }
    return [];
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (e) { }
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

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

            // Aggressive Sync: Fetch full details for ALL products to ensure descriptions are present
            const allIds = [...new Set([
                ...shopProducts.map(p => p.id),
                ...shopGroups.flatMap(g => (g.products || []).map(gp => gp.id))
            ])];

            if (allIds.length > 0) {
                console.log(`[SYNC] Fully Aggressive: Fetching ${allIds.length} products to capture complete details...`);
                // Batch fetch to speed up sync while respecting potential rate limits
                const BATCH_SIZE = 5;
                const updatedProducts = [];

                for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
                    const batch = allIds.slice(i, i + BATCH_SIZE);
                    const batchResults = await Promise.all(batch.map(async (id) => {
                        try {
                            const detail = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${id}`, {
                                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
                                timeout: 10000
                            });
                            return detail.data.data || detail.data;
                        } catch (e) {
                            console.error(`Failed to fetch ${id}:`, e.message);
                            return shopProducts.find(p => p.id === id);
                        }
                    }));
                    updatedProducts.push(...batchResults.filter(Boolean));
                }

                shopProducts.length = 0;
                shopProducts.push(...updatedProducts);
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

        // Robust Description Consolidation
        const stripHtml = (html) => {
            if (!html) return '';
            return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        };

        const finalProducts = allProductsFlat.map(p => {
            let desc = p.description || p.short_description || p.instructions;

            // If main source is still missing/empty, check variants
            if (!desc || stripHtml(desc).length < 2) {
                const variants = p.variants || [];
                for (const v of variants) {
                    const candidate = v.description || v.instructions;
                    if (candidate && stripHtml(candidate).length > 2) {
                        desc = candidate;
                        break;
                    }
                }
            }
            return { ...p, description: desc };
        });

        const finalGroups = Array.from(mergedMap.values());
        const finalData = { groups: finalGroups, products: finalProducts };

        setCachedData(finalData);
        console.log(`[SYNC] Success. Cached ${finalGroups.length} groups and ${finalProducts.length} products with consolidated descriptions.`);
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
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);
    const productId = req.params.id;

    if (!API_KEY || SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "Missing config" });
    }

    // Try each shop until we find the product
    for (const shopId of SHOP_IDS) {
        try {
            const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
                timeout: 5000 // Shorter timeout per shop
            });
            const product = response.data.data || response.data;
            if (product) return res.json(product);
        } catch (error) {
            // If not 404, log it, but continue to next shop regardless
            if (error.response?.status !== 404) {
                console.error(`Detail Handler Error (Shop ${shopId}, Product ${productId}):`, error.message);
            }
        }
    }

    res.status(404).json({ error: "Product not found in any configured shop" });
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

// --- AUTHENTICATION ENDPOINTS ---

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const users = getUsers();
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, email: newUser.email } });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// --- USER ORDER RETRIEVAL ---

app.get('/api/user/orders', authenticateToken, async (req, res) => {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_ID = (SHOP_ID_CONFIG || '').split(',')[0].trim();
    const email = req.user.email;

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/invoices`, {
            params: { email },
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        const invoices = response.data.data || [];
        const orders = invoices.map(inv => ({
            id: inv.id,
            status: inv.status,
            total: inv.total,
            created_at: inv.created_at,
            items: (inv.items || []).map(item => ({
                product_name: item.product?.name || "Premium Product",
                variant_name: item.variant?.name || "Standard",
                quantity: item.quantity,
                keys: item.delivered_data || []
            }))
        }));

        res.json({ orders });
    } catch (e) {
        console.error('Local server orders error:', e.message);
        res.status(500).json({ orders: [] });
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
