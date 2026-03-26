const http = require('http');

const data = JSON.stringify({
    name: 'Jamunadevi',
    email: 'jamunadevig.23aim@kongu.edu',
    password: 'password',
    phone: '',
    address: '',
    city: '',
    pincode: ''
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
