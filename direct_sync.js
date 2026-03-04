import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const CACHE_FILE = '.sellauth_cache.json';

async function sync() {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    if (!API_KEY || SHOP_IDS.length === 0) {
        console.error("Missing config");
        return;
    }

    console.log("[SYNC] Starting direct sync...");
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

            const allIds = [...new Set([
                ...shopProducts.map(p => p.id),
                ...shopGroups.flatMap(g => (g.products || []).map(gp => gp.id))
            ])];

            if (allIds.length > 0) {
                console.log(`[SYNC] Fully Aggressive: Fetching ${allIds.length} products...`);
                const fullProducts = [];
                for (const id of allIds) {
                    try {
                        const detail = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${id}`, {
                            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                        });
                        const product = detail.data.data || detail.data;
                        if (product) fullProducts.push(product);
                    } catch (e) {
                        console.error(`Failed to fetch ${id}:`, e.message);
                        const basic = shopProducts.find(p => p.id === id);
                        if (basic) fullProducts.push(basic);
                    }
                }
                shopProducts.length = 0;
                shopProducts.push(...fullProducts);
            }

            allGroups.push(...shopGroups);
            allProductsFlat.push(...shopProducts);
        } catch (err) {
            console.error(`Error fetching for shop ${shopId}:`, err.message);
        }
    }

    // Merge groups
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

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const finalProducts = allProductsFlat.map(p => {
        let desc = p.description || p.short_description || p.instructions;
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

    const finalData = { groups: Array.from(mergedMap.values()), products: finalProducts };

    fs.writeFileSync(CACHE_FILE, JSON.stringify({
        data: finalData,
        timestamp: Date.now()
    }, null, 2));

    console.log(`[SYNC] Success. Cached ${finalData.groups.length} groups and ${finalData.products.length} products.`);
}

sync();
