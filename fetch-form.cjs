const https = require('https');

https.get('https://metacheat.mysellauth.com/product/r6-zeroday-chair', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const formRegex = /<form[^>]*action="([^"]+)"[^>]*>([\s\S]*?)<\/form>/gi;
        let match;
        while ((match = formRegex.exec(data)) !== null) {
            if (match[0].includes('submit') || match[0].includes('Buy Now')) {
                console.log("Action:", match[1]);
                const inputRegex = /<input[^>]+name="([^"]+)"(?:[^>]+value="([^"]*)")?[^>]*>/gi;
                let inMatch;
                while ((inMatch = inputRegex.exec(match[2])) !== null) {
                    console.log(`  ${inMatch[1]}: ${inMatch[2] || 'N/A'}`);
                }
            }
        }
    });
}).on('error', (err) => {
    console.error(err);
});
