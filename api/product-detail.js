import axios from 'axios';

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
    const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID || "169969";
    const SHOP_ID = (SHOP_ID_CONFIG || '').split(',')[0].trim();

    // Support both /api/product-detail?id=XXX and /api/product-detail/XXX (via rewrites)
    const urlParts = req.url.split('/').filter(Boolean);
    let productId = req.query.id;

    if (!productId && urlParts.length > 2) {
        productId = urlParts[2].split('?')[0];
    }

    if (!productId) {
        return res.status(400).json({ error: "Missing product ID" });
    }

    if (!API_KEY || !SHOP_ID) {
        return res.status(500).json({ error: "Missing configuration" });
    }

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
            timeout: 10000
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Vercel Detail Handler Error (${productId}):`, error.message);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
}
