import axios from 'axios';

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID || "169969";
    const SHOP_IDS = (SHOP_ID_CONFIG || '').split(',').map(id => id.trim()).filter(id => id);

    // Extract ID from URL (e.g., /api/product-detail/123)
    const urlParts = req.url.split('/').filter(Boolean);
    let productId = null;
    if (urlParts.length > 2) {
        productId = urlParts[2].split('?')[0];
    } else if (req.query && req.query.id) {
        productId = req.query.id;
    }

    if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
    }

    if (!API_KEY || SHOP_IDS.length === 0) {
        return res.status(500).json({ error: "Missing config" });
    }

    // Try each shop until we find the product
    for (const shopId of SHOP_IDS) {
        try {
            const response = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
                timeout: 5000
            });
            const product = response.data.data || response.data;
            if (product) {
                // Apply robust description consolidation here too
                const stripHtml = (html) => {
                    if (!html) return '';
                    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                };

                let desc = product.description || product.short_description || product.instructions;
                if (!desc || stripHtml(desc).length < 2) {
                    const variants = product.variants || [];
                    for (const v of variants) {
                        const candidate = v.description || v.instructions;
                        if (candidate && stripHtml(candidate).length > 2) {
                            desc = candidate;
                            break;
                        }
                    }
                }
                product.description = desc;
                return res.status(200).json(product);
            }
        } catch (error) {
            // If not 404, log it, but continue to next shop regardless
            if (error.response?.status !== 404) {
                console.error(`Detail Handler Error (Shop ${shopId}, Product ${productId}):`, error.message);
            }
        }
    }

    res.status(404).json({ error: "Product not found in any configured shop" });
}
