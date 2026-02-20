const crypto = require('crypto');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const signature = req.headers['x-sellauth-signature'];
    const payload = JSON.stringify(req.body);
    const SELLAUTH_WEBHOOK_SECRET = process.env.SELLAUTH_WEBHOOK_SECRET;

    // Verify Signature
    const hmac = crypto.createHmac('sha256', SELLAUTH_WEBHOOK_SECRET || 'dev_secret');
    const digest = hmac.update(payload).digest('hex');

    if (signature !== digest) {
        console.error('Invalid Webhook Signature');
        return res.status(401).send('Unauthorized');
    }

    const { type, data } = req.body;

    if (type === 'order.completed') {
        const username = data.custom_fields?.username || 'GUEST';
        const amount = parseFloat(data.total_amount);

        // Note: In production, you would update a real database here (e.g., Supabase/MongoDB)
        console.log(`Payment: ${amount} from ${username}`);
        return res.status(200).json({ message: 'Order processed' });
    }

    res.status(200).send('Webhook Received');
};
