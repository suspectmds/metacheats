const https = require('https');
const options = {
    hostname: 'api.sellauth.com',
    path: '/v1/shops/169969/products?per_page=10',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer 5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8',
        'Accept': 'application/json'
    }
};
const req = https.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        const data = JSON.parse(body);
        const products = data.data || data.products || [];
        const withVariants = products.filter(p => p.variants && p.variants.length > 0);
        if (withVariants.length > 0) {
            console.log('Product:', withVariants[0].name);
            withVariants[0].variants.forEach(v => {
                console.log(JSON.stringify(v, null, 2));
            });
        }
    });
});
req.end();
