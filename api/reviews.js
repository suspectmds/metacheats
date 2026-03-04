import axios from 'axios';

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY || "5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8";
    const SHOP_ID = (process.env.SELLAUTH_SHOP_ID || "169969").split(',')[0].trim();

    if (!API_KEY) {
        return res.status(500).json({ error: "Server missing API_KEY configuration" });
    }
    if (!SHOP_ID) {
        return res.status(500).json({ error: "Server missing SHOP_ID configuration" });
    }

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks?per_page=100`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const feedbacks = response.data.data || [];

        const mappedReviews = feedbacks.map(f => {
            const product = f.invoice?.items?.[0]?.product?.name || f.order?.product?.name || f.product?.name;
            const hasRealMessage = f.message && f.message.trim().length > 0;
            const dateStr = f.created_at ? new Date(f.created_at).toLocaleDateString() : 'Recently';

            return {
                user: f.invoice?.email ? f.invoice.email.split('@')[0] : (f.email ? f.email.split('@')[0] : "Verified User"),
                date: dateStr,
                rating: f.rating || 5,
                comment: hasRealMessage ? f.message : (product ? `Verified purchase: ${product}` : "Premium service, highly recommend!"),
                product: product || "Premium Product",
                created_at: f.created_at || new Date().toISOString(),
                is_automatic: !!f.is_automatic
            };
        });

        res.status(200).json({ reviews: mappedReviews });
    } catch (error) {
        console.error('SellAuth API Error (Feedbacks):', error.response?.data || error.message);
        res.status(500).json({ reviews: [], error: "Failed to fetch reviews" });
    }
};
