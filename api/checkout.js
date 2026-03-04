import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { productId, variantId } = req.body;
    if (!productId || !variantId) {
        return res.status(400).json({ error: "Missing product or variant ID" });
    }

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
                return res.status(200).json({ url: checkoutUrl });
            }
        } catch (e) {
            lastError = e.response?.data || e.message;
            console.warn(`[CHECKOUT] Trial on Shop ${shopId} failed:`, lastError);
            // Continue to next shop...
        }
    }

    console.error('[CHECKOUT] All shops failed:', lastError);
    return res.status(500).json({ error: "Failed to create checkout session across all shops", details: lastError });
}
