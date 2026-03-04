import axios from 'axios';

// Shared Cache Configuration
let groupsCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 300000; // 5 Minutes

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID || "169969";
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (!API_KEY || SHOP_IDS.length === 0) {
        console.error("Missing SELLAUTH_API_KEY or SELLAUTH_SHOP_ID");
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    console.log(`[API] Products request received. Refresh: ${req.query?.refresh === 'true'}`);

    const urlParts = req.url.split('/').filter(Boolean);
    let productId = null;
    if (urlParts.length > 2) {
        productId = urlParts[2].split('?')[0];
    } else if (req.query && req.query.id) {
        productId = req.query.id;
    }

    // Handle Product Detail
    if (productId) {
        try {
            const shopId = SHOP_IDS[0];
            const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
                timeout: 10000
            });
            return res.status(200).json(response.data);
        } catch (error) {
            console.error(`Detail Fetch Error:`, error.message);
            return res.status(500).json({ error: "Failed to fetch product details" });
        }
    }

    // Handle Groups Fetch (with Deep Sync & Merging)
    try {
        const now = Date.now();
        if (groupsCache.data && (now - groupsCache.timestamp < CACHE_DURATION) && req.query?.refresh !== 'true') {
            console.log("[CACHE] Returning cached groups and products");
            return res.status(200).json({ ...groupsCache.data, cached: true });
        }
        console.log("[CACHE] Cache miss or forced refresh. Starting deep sync...");

        let allGroups = [];
        let allProductsFlat = [];

        for (const shopId of SHOP_IDS) {
            console.log(`[SYNC] Fetching for Shop ${shopId}...`);
            try {
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

                // Track missing products found in groups
                const existingProductIds = new Set(shopProducts.map(p => p.id));
                const missingProductIds = [];

                shopGroups.forEach(group => {
                    const groupProds = group.products || [];
                    groupProds.forEach(gp => {
                        if (!existingProductIds.has(gp.id)) {
                            missingProductIds.push(gp.id);
                            existingProductIds.add(gp.id);
                        }
                    });
                });

                // Deep Sync: Fetch missing products individually
                if (missingProductIds.length > 0) {
                    console.log(`[SYNC] Deep sync: Fetching ${missingProductIds.length} missing products...`);
                    const fetchPromises = missingProductIds.map(id =>
                        axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${id}`, {
                            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                        }).catch(e => {
                            console.error(`[SYNC] Failed to fetch missing product ${id}:`, e.message);
                            return null;
                        })
                    );
                    const fetchedDetails = await Promise.all(fetchPromises);
                    fetchedDetails.forEach(fd => {
                        if (fd && fd.data) shopProducts.push(fd.data);
                    });
                }

                allGroups.push(...shopGroups);
                allProductsFlat.push(...shopProducts);
            } catch (err) {
                console.error(`Error fetching for shop ${shopId}:`, err.message);
            }
        }

        // Merge Groups with identical names
        const mergedGroupsMap = new Map();
        allGroups.forEach(group => {
            const name = group.name.trim();
            if (mergedGroupsMap.has(name)) {
                const existing = mergedGroupsMap.get(name);
                // Mark this as a merged group
                existing.isMerged = true;
                existing.mergedIds = existing.mergedIds || [existing.id];
                existing.mergedIds.push(group.id);

                // Combine product summaries
                const combinedProds = [...(existing.products || []), ...(group.products || [])];
                const uniqueIds = new Set();
                existing.products = combinedProds.filter(p => {
                    if (uniqueIds.has(p.id)) return false;
                    uniqueIds.add(p.id);
                    return true;
                });
            } else {
                mergedGroupsMap.set(name, { ...group, mergedIds: [group.id] });
            }
        });

        const finalGroups = Array.from(mergedGroupsMap.values());
        const checkerFound = allProductsFlat.some(p => p.id === 632842 || String(p.id) === '632842');

        groupsCache = { data: { groups: finalGroups, products: allProductsFlat, checkerFound }, timestamp: now };
        console.log(`[SYNC] Success. Checker Found: ${checkerFound}. Cached ${finalGroups.length} groups.`);

        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.status(200).json({ groups: finalGroups, products: allProductsFlat, checkerFound });

    } catch (error) {
        console.error('Core Sync API Error:', error.message);
        if (groupsCache.data) {
            return res.status(200).json({ ...groupsCache.data, isStale: true });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
