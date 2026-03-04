import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID || "169969";
const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

async function sync() {
    let allGroups = [];
    let allProductsFlat = [];

    try {
        for (const shopId of SHOP_IDS) {
            console.log(`Fetching Shop ${shopId}...`);
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
            const missingIds = shopProducts.map(p => p.id);

            // Check groups for any products not in the main list (secondary check)
            shopGroups.forEach(g => {
                (g.products || []).forEach(gp => {
                    if (!missingIds.includes(gp.id)) {
                        missingIds.push(gp.id);
                    }
                });
            });

            if (missingIds.length > 0) {
                console.log(`Deep sync: Fetching ${missingIds.length} missing products...`);
                for (const id of missingIds) {
                    try {
                        const detail = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${id}`, {
                            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
                        });
                        // SellAuth sometimes returns the object directly, sometimes wrapped in { data: ... }
                        const product = detail.data.data || detail.data;
                        if (product) {
                            // Replace if exists, else push
                            const idx = shopProducts.findIndex(p => p.id === product.id);
                            if (idx !== -1) {
                                shopProducts[idx] = product;
                            } else {
                                shopProducts.push(product);
                            }
                        }
                    } catch (e) { console.error(`Failed to fetch ${id}:`, e.message); }
                }
            }

            allGroups.push(...shopGroups);
            allProductsFlat.push(...shopProducts);
        }

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

        fs.writeFileSync('.sellauth_cache.json', JSON.stringify({
            data: finalData,
            timestamp: Date.now()
        }, null, 2));

        console.log(`Sync Success. Cached ${finalGroups.length} groups and ${allProductsFlat.length} products.`);
    } catch (error) {
        console.error('Sync error:', error.message);
    }
}

sync();
