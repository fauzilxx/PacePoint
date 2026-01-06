const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Allow CORS for the frontend
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL || '*', // Allow all by default for easier testing, refine in prod if strict
    methods: ['GET', 'POST']
}));

// Mock Database
// Key: paymentId, Value: { id, amount, status: 'PENDING' | 'PAID', createdAt }
const paymentStore = new Map();

// Helper to generate ID
const generateId = () => Math.random().toString(36).substring(2, 10);

app.get('/', (req, res) => {
    res.send('PacePoint Mock Backend is Running');
});

// 1. Initiate Payment
// Returns paymentId and a URL to display as QR
app.post('/api/pay/init', async (req, res) => {
    const { amount } = req.body;
    const paymentId = generateId();

    // Default base URL if not set
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';

    // The public URL that the user scans
    // Logic: Scanned QR -> Opens {FRONTEND_HOST}/pay/{paymentId}
    const paymentPageUrl = `${frontendBaseUrl}/pay/${paymentId}`;

    paymentStore.set(paymentId, {
        id: paymentId,
        amount: amount || 0,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    });

    console.log(`[Payment Init] ID: ${paymentId}, URL: ${paymentPageUrl}`);

    res.json({
        paymentId,
        paymentPageUrl
    });
});

// 2. Poll Status
app.get('/api/pay/:id/status', (req, res) => {
    const { id } = req.params;
    const payment = paymentStore.get(id);

    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
        id: payment.id,
        status: payment.status
    });
});

// 3. Confirm Payment (Called by the Public Payment Page opened by phone)
app.post('/api/pay/:id/confirm', (req, res) => {
    const { id } = req.params;
    const payment = paymentStore.get(id);

    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    // Mock processing success
    payment.status = 'PAID';
    paymentStore.set(id, payment);

    console.log(`[Payment Confirmed] ID: ${id}`);

    res.json({
        success: true,
        status: 'PAID'
    });
});

// 4. Get Payment Details (For the public payment page to show info)
app.get('/api/pay/:id', (req, res) => {
    const { id } = req.params;
    const payment = paymentStore.get(id);

    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
