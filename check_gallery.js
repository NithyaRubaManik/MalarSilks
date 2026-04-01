const axios = require('axios');

async function checkSubmissions() {
    try {
        const res = await axios.get('https://malarsilks-1.onrender.com/api/submissions');
        console.log('Submissions:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSubmissions();
