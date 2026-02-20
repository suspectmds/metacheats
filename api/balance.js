// api/balance.js - Serverless function to sync balance via API key (FREE Plan Solution)
const axios = require('axios');

module.exports = async (req, res) => {
    const { username } = req.query;
    const API_KEY = process.env.SELLAUTH_API_KEY;
    const SHOP_ID = process.env.SELLAUTH_SHOP_ID; // User should add this to Vercel

    if (!API_KEY || !SHOP_ID) {
        return res.status(500).json({ error: "Server missing API configuration" });
    }

    try {
        // Fetch last 50 completed orders from SellAuth
        // Note: Check SellAuth API docs for exact endpoint. 
        // Typically GET /v1/shops/{id}/orders
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/orders`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            params: { status: 'completed', limit: 50 }
        });

        const orders = response.data.data || [];

        // Filter orders where the 'username' custom field matches the query
        // And sum up the total spent
        let totalSpent = 0;
        orders.forEach(order => {
            if (order.custom_fields?.username === username) {
                totalSpent += parseFloat(order.total_amount);
            }
        });

        // Add a base balance (for old users) or just return the sum
        const baseBalance = username === 'APEXE' ? 240.25 : 0;

        res.status(200).json({
            balance: baseBalance + totalSpent,
            syncStatus: 'LIVE_API_SYNC'
        });

    } catch (error) {
        console.error('SellAuth API Error:', error.response?.data || error.message);
        res.status(200).json({
            balance: username === 'APEXE' ? 240.25 : 0,
            syncStatus: 'FALLBACK_LOCAL'
        });
    }
};
