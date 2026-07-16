const https = require('https');

https.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=10', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Data Length:", data.length);
    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      console.log("Jobs Count:", parsed.jobs ? parsed.jobs.length : 0);
      if (parsed.jobs && parsed.jobs.length > 0) {
        console.log("First Job:", parsed.jobs[0].title, "at", parsed.jobs[0].company_name);
      }
    } else {
      console.log("Preview:", data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});
