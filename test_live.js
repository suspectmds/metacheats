import https from 'https';
https.get('https://metacheat.org/', res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        const jsMatch = body.match(/src=\"\/assets\/(index-[a-zA-Z0-9_-]+\.js)\"/);
        if (!jsMatch) return console.log('no js file found');
        console.log('Main JS file in index.html:', jsMatch[1]);

        https.get('https://metacheat.org/assets/' + jsMatch[1], jsRes => {
            let jsBody = '';
            jsRes.on('data', d => jsBody += d);
            jsRes.on('end', () => {
                const hasNewCode = jsBody.match(/[a-zA-Z]\.name\|\|[a-zA-Z]\.title/);
                console.log('Does the live JS contain the updated code?', !!hasNewCode);
            });
        });
    });
});
