import axios from 'axios';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'metacheats-premium-security-2026';

export default async function handler(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        const API_KEY = process.env.SELLAUTH_API_KEY;
        const SHOP_ID_CONFIG = process.env.SELLAUTH_SHOP_ID;
        const SHOP_ID = (SHOP_ID_CONFIG || '').split(',')[0].trim();

        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/invoices`, {
            params: { email },
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        const invoices = response.data.data || [];
        const orders = invoices.map(inv => ({
            id: inv.id,
            status: inv.status,
            total: inv.total,
            created_at: inv.created_at,
            items: (inv.items || []).map(item => ({
                product_name: item.product?.name || "Premium Product",
                variant_name: item.variant?.name || "Standard",
                quantity: item.quantity,
                keys: item.delivered_data || []
            }))
        }));

        res.json({ orders });
    } catch (e) {
        console.error('API Server orders error:', e.message);
        res.status(500).json({ orders: [] });
    }
}
