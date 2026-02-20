import axios from 'axios';

// Cache for groups (1 minute TTL)
let groupsCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 60000;

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (!API_KEY || SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    // Check if we are fetching a specific product detail
    // Vercel routes /api/products/[id] -> req.query[0] or similar if configured
    // But we'll handle the ?id= query param or the tailing path
    const urlParts = req.url.split('/').filter(Boolean);
    const productId = urlParts.length > 2 ? urlParts[2].split('?')[0] : req.query.id;

    if (productId) {
        try {
            const shopId = SHOP_IDS[0];
            const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            return res.status(200).json(response.data);
        } catch (error) {
            console.error(`SellAuth Product [${productId}] Fetch Error:`, error.message);
            return res.status(500).json({ error: "Failed to fetch product details" });
        }
    }

    // Fetch All Groups (with Cache)
    try {
        const now = Date.now();
        if (groupsCache.data && (now - groupsCache.timestamp < CACHE_DURATION)) {
            return res.status(200).json({ groups: groupsCache.data });
        }

        let allGroups = [];
        for (const shopId of SHOP_IDS) {
            const resp = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/groups`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            allGroups = [...allGroups, ...(resp.data.data || [])];
        }

        groupsCache = { data: allGroups, timestamp: now };
        res.status(200).json({ groups: allGroups });
    } catch (error) {
        console.error('SellAuth API Error:', error.message);
        if (groupsCache.data) return res.status(200).json({ groups: groupsCache.data });
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
