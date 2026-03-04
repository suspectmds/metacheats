import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3002;

async function testDetail() {
    try {
        console.log('Testing local /api/product-detail/465176...');
        const res = await axios.get(`http://localhost:${PORT}/api/product-detail/465176`);
        console.log('Keys in response:', Object.keys(res.data).join(', '));
        console.log('Description:', res.data.description);
        if (res.data.data) {
            console.log('Found nested data object. Description inside:', res.data.data.description);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testDetail();
