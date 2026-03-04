import axios from 'axios';

const API_KEY = "5555320|TN3mUsZ8TB4ESf5JrN5ovQEtunDOR4ykLoePdu2f2629f464";
const SHOP_ID = "218489";

async function test() {
    try {
        console.log(`Testing Shop ${SHOP_ID}...`);
        const response = await axios.get(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products?per_page=100`, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const products = response.data.data || response.data.products || [];
        console.log(`Success! Found ${products.length} products.`);

        products.forEach(p => {
            if (p.name.toLowerCase().includes('vega')) {
                console.log('--- VEGA FOUND ---');
                console.log('ID:', p.id);
                console.log('Description:', p.description);
                console.log('Variants with desc:', p.variants?.filter(v => v.description).length);
            }
        });

        if (products.length > 0 && !products.some(p => p.name.toLowerCase().includes('vega'))) {
            console.log('Vega not found in this shop.');
            console.log('Sample product:', products[0].name, 'Desc:', !!products[0].description);
        }
    } catch (e) {
        console.error('Error:', e.response ? e.response.status : e.message);
    }
}

test();
