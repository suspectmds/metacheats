import axios from 'axios';

async function testLocalApi() {
    console.log('Testing local API at http://localhost:3002/api/reviews');
    try {
        const response = await axios.get('http://localhost:3002/api/reviews');
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching local API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testLocalApi();
