const axios = require('axios');

// Simple in-memory store for rate limiting
// In production, you might want to use a database or Redis
const rateLimitStore = new Map();

// Rate limiting: 1 request per 10 minutes per IP
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 1;

function isRateLimited(clientIP) {
    const now = Date.now();
    const clientData = rateLimitStore.get(clientIP);
    
    if (!clientData) {
        // First request from this IP
        rateLimitStore.set(clientIP, {
            count: 1,
            firstRequest: now
        });
        return false;
    }
    
    // Check if we're still within the rate limit window
    if (now - clientData.firstRequest < RATE_LIMIT_WINDOW) {
        if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
            return true; // Rate limited
        }
        // Increment count
        clientData.count++;
        return false;
    } else {
        // Reset rate limit for this IP
        rateLimitStore.set(clientIP, {
            count: 1,
            firstRequest: now
        });
        return false;
    }
}

// Clean up old entries periodically to prevent memory leaks
function cleanupRateLimitStore() {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
            rateLimitStore.delete(ip);
        }
    }
}

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }

    // Get client IP for rate limiting
    const clientIP = event.headers['client-ip'] || 
                    event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    'unknown';

    // Check rate limit
    if (isRateLimited(clientIP)) {
        return {
            statusCode: 429,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: false, 
                message: "You're doing that too much. Try again later." 
            })
        };
    }

    // Clean up old rate limit entries
    cleanupRateLimitStore();

    try {
        // Parse the request body
        const { name, email, message } = JSON.parse(event.body);

        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
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