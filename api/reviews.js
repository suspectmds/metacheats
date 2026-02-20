import axios from 'axios';

export default async function handler(req, res) {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID = process.env.SELLAUTH_SHOP_ID;

    if (!API_KEY || !SHOP_ID) {
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/feedbacks`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        const feedbacks = response.data.data || [];

        // Map to frontend format
        const mappedReviews = feedbacks.map(f => ({
            user: f.email ? f.email.split('@')[0] : "Verified User",
            date: new Date(f.created_at).toLocaleDateString(),
            rating: f.rating || 5,
            comment: f.comment || "No comment provided.",
            product: f.order?.product?.name || "Premium Product"
        }));

        res.status(200).json({ reviews: mappedReviews });
    } catch (error) {
        console.error('SellAuth API Error (Feedbacks):', error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};
