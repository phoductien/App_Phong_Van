const https = require('https');

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/awesome-jobs/vietnam/issues?state=open&per_page=15',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    if (res.statusCode === 200) {
      try {
        const issues = JSON.parse(data);
        console.log("Issues retrieved:", issues.length);
        if (issues.length > 0) {
          console.log("First issue title:", issues[0].title);
          console.log("First issue labels:", issues[0].labels.map(l => l.name));
          console.log("First issue body preview:", issues[0].body ? issues[0].body.substring(0, 300) : "No body");
        }
      } catch (err) {
        console.error("Parse error:", err.message);
      }
    } else {
      console.log("Error body:", data);
    }
  });
}).on('error', (err) => {
  console.error("Fetch error:", err.message);
});
