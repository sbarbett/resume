const axios = require('axios');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { name, email, message } = JSON.parse(event.body);

        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'All fields are required!' })
            };
        }

        // Prepare the payload for Discord
        const payload = {
            content: `New contact form submission:\n\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`
        };

        // Send the data to Discord
        const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
        
        if (response.status === 204) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Your message has been sent successfully!' 
                })
            };
        } else {
            console.error('Discord webhook failed:', response.status, response.data);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Failed to send your message. Please try again later.' 
                })
            };
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: false, 
                message: 'An unexpected error occurred. Please try again.' 
            })
        };
    }
}; 