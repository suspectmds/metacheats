import axios from 'axios';

// Emergency High-Duration Cache (1 Hour)
let groupsCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 3600000;

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (!API_KEY || SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    const urlParts = req.url.split('/').filter(Boolean);
    const productId = urlParts.length > 2 ? urlParts[2].split('?')[0] : req.query.id;

    // Handle Product Detail
    if (productId) {
        try {
            const shopId = SHOP_IDS[0];
            const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` },
                timeout: 5000
            });
            return res.status(200).json(response.data);
        } catch (error) {
            console.error(`Detail Fetch Error:`, error.message);
            return res.status(500).json({ error: "Failed to fetch product details" });
        }
    }

    // Handle Groups Fetch (with Product Reconstruction)
    try {
        const now = Date.now();
        if (groupsCache.data && (now - groupsCache.timestamp < CACHE_DURATION)) {
            return res.status(200).json({ groups: groupsCache.data, cached: true });
        }

        let allGroups = [];
        for (const shopId of SHOP_IDS) {
            try {
                const [gRes, pRes] = await Promise.all([
                    axios.get(`https://api.sellauth.com/v1/shops/${shopId}/groups`, {
                        headers: { 'Authorization': `Bearer ${API_KEY}` },
                        timeout: 10000
                    }),
                    axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products?per_page=100`, {
                        headers: { 'Authorization': `Bearer ${API_KEY}` },
                        timeout: 10000
                    })
                ]);

                const shopGroups = gRes.data.data || [];
                const productsShort = pRes.data.data || [];

                // NEW: Fetch DETAILED information for each product to get descriptions
                const detailedProducts = [];
                // Use a smaller delay for serverless execution speed (200ms)
                for (const p of productsShort) {
                    try {
                        const detailRes = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${p.id}`, {
                            headers: { 'Authorization': `Bearer ${API_KEY}` },
                            timeout: 8000
                        });
                        detailedProducts.push(detailRes.data || p);
                        await new Promise(r => setTimeout(r, 200));
                    } catch (e) {
                        console.error(`Detail Fetch Fail ${p.id}:`, e.message);
                        detailedProducts.push(p);
                    }
                }

                // Map products to groups using robust string comparison
                shopGroups.forEach(group => {
                    group.products = detailedProducts.filter(p => String(p.group_id) === String(group.id));
                });

                allGroups = [...allGroups, ...shopGroups];
            } catch (inner) {
                if (inner.response?.status === 429) throw inner;
                console.error(`Shop ${shopId} Sync Error:`, inner.message);
            }
        }

        if (allGroups.length > 0) {
            groupsCache = { data: allGroups, timestamp: now };
        }
        res.status(200).json({ groups: allGroups });
    } catch (error) {
        console.error('Core Sync API Error:', error.message);
        if (groupsCache.data) {
            return res.status(200).json({ groups: groupsCache.data, isStale: true });
        }
        res.status(429).json({ error: "Rate limit active." });
    }
};
