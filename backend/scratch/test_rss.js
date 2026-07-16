const https = require('https');

const options = {
  hostname: 'www.careerjet.vn',
  port: 443,
  path: '/search/rss?s=it&l=vietnam',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Data Length:", data.length);
    console.log("Preview:", data.substring(0, 1000));
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});
