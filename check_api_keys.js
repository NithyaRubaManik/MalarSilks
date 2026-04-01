const https = require('https');

async function check() {
  const options = {
    hostname: 'malarsilks-1.onrender.com',
    port: 443,
    path: '/api/users',
    method: 'GET'
  };
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (ch) => { data += ch; });
    res.on('end', () => {
        const obj = JSON.parse(data);
        if (obj.data && obj.data.length > 0) {
            console.log('Keys:', Object.keys(obj.data[0]));
            console.log('First Item:', obj.data[0]);
        } else {
            console.log('No data');
        }
    });
  });
  req.end();
}

check();
