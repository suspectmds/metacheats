import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3002;

async function refresh() {
    try {
        console.log('Requesting cache refresh from local server...');
        const response = await axios.get(`http://localhost:${PORT}/api/products?refresh=true`);
        console.log('Refresh Success!');
        console.log('Groups found:', response.data.groups?.length);
        console.log('Products found:', response.data.products?.length);
    } catch (e) {
        console.error('Error refreshing:', e.message);
        console.log('Make sure the server is running (npm run dev).');
    }
}

refresh();
