import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { productId, variantId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const shopId = process.env.SELLAUTH_SHOP_ID;
    const apiKey = process.env.SELLAUTH_API_KEY;

    if (!shopId || !apiKey) {
        return res.status(500).json({ error: 'Server configuration missing' });
    }

    try {
        const payload = {
            cart: [
                {
                    productId: productId,
                    quantity: 1
                }
            ]
        };

        if (variantId) {
            payload.cart[0].variantId = variantId;
        }

        const response = await axios.post(
            `https://api.sellauth.com/v1/shops/${shopId}/checkout`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.url) {
            return res.status(200).json({ url: response.data.url });
        } else {
            return res.status(500).json({ error: 'Failed to generate checkout URL', details: response.data });
        }

    } catch (error) {
        console.error('Checkout API Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create checkout session';
        return res.status(error.response?.status || 500).json({ error: errorMessage });
    }
}
