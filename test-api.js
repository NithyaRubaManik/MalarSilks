const http = require('http');

http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Body snippet:', data.substring(0, 500));
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
