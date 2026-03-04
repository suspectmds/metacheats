import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'metacheats-premium-security-2026';

export default async function handler(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ user: decoded });
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
}
