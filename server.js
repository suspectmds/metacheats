const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());

// Placeholder "Database" (Replace with SQLite or MongoDB for production)
let userBalances = {
    'APEXE': 240.25
};

// SellAuth Webhook Secret (Set this in your environment variables)
const SELLAUTH_WEBHOOK_SECRET = process.env.SELLAUTH_WEBHOOK_SECRET || 'your_webhook_secret_here';

// Balance Check Endpoint
app.get('/api/balance/:username', (req, res) => {
    const { username } = req.params;
    res.json({ balance: userBalances[username] || 0 });
});

// SellAuth Webhook Receiver
app.post('/api/webhook', (req, res) => {
    const signature = req.headers['x-sellauth-signature'];
    const payload = JSON.stringify(req.body);

    // Verify Signature (Important for security)
    const hmac = crypto.createHmac('sha256', SELLAUTH_WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');

    if (signature !== digest) {
        console.error('Invalid Webhook Signature');
        return res.status(401).send('Unauthorized');
    }

    const { type, data } = req.body;

    // Handle Successful Payment
    if (type === 'order.completed') {
        const username = data.custom_fields?.username || 'GUEST';
        const amount = parseFloat(data.total_amount);

        console.log(`Payment Received: ${amount} from ${username}`);

        // Update Balance
        if (!userBalances[username]) userBalances[username] = 0;
        userBalances[username] += amount;

        return res.status(200).send('Balance Updated');
    }

    res.status(200).send('Webhook Received');
});

app.listen(PORT, () => {
    console.log(`MetaCheats Backend running on port ${PORT}`);
});
