import os
import requests
import markdown
from flask import Flask, render_template, request, jsonify, abort
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load variables from environment
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default_secret_key')  # Fallback for missing .env
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

# Initialize Flask-Limiter for rate limiting
limiter = Limiter(
    key_func=get_remote_address,  # Identify clients by IP address
    app=app
)

@app.route('/')
def resume():
    return render_template('resume.html')

@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({
        'success': False,
        'message': "You're doing that too much. Try again later."
    }), 429

@app.route('/contact', methods=['POST'])
@limiter.limit("1 per 10 minutes", error_message="Please wait before sending another message.")
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'All fields are required!'}), 400

        # Prepare the payload for Discord
        payload = {
            "content": f"New contact form submission:\n\n**Name:** {name}\n**Email:** {email}\n**Message:** {message}"
        }

        # Send the data to Discord
        response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
        if response.status_code == 204:
            return jsonify({'success': True, 'message': 'Your message has been sent successfully!'}), 200
        else:
            app.logger.error(f"Discord webhook failed: {response.status_code}, {response.text}")
            return jsonify({'success': False, 'message': 'Failed to send your message. Please try again later.'}), 500
    except Exception as e:
        app.logger.exception("An unexpected error occurred.")
        return jsonify({'success': False, 'message': 'An unexpected error occurred. Please try again.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
