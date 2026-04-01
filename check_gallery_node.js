const http = require('http');

async function testPath(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (ch) => { data += ch; });
      res.on('end', () => resolve({ path, statusCode: res.statusCode, data }));
    });
    req.on('error', (e) => resolve({ path, error: e.message }));
    req.end();
  });
}

async function run() {
  const r1 = await testPath('/api/users');
  console.log('Users:', JSON.stringify(r1, null, 2));
  const r2 = await testPath('/api/submissions');
  console.log('Submissions:', JSON.stringify(r2, null, 2));
}

run();
