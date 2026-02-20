const axios = require('axios');

module.exports = async (req, res) => {
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID = process.env.SELLAUTH_SHOP_ID;

    if (!API_KEY || !SHOP_ID) {
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    try {
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/groups`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        // The API returns all groups, each containing a products array
        const groups = response.data.data || [];
        console.log(`Fetch Successful: ${groups.length} groups found`);

        res.status(200).json({ groups });
    } catch (error) {
        console.error('SellAuth API Error:', error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to fetch products",
            details: error.response?.data?.message || error.message,
            hint: "Check if SELLAUTH_API_KEY and SELLAUTH_SHOP_ID are correct in Vercel."
        });
    }
};
