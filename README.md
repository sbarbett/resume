
# resume

This is a simple web app I created as a personal splash page and to provide an easy way for people to contact me. The page includes:

- A brief summary of my background.
- A list of technical skills.
- Links to my GitHub and LinkedIn profiles.
- A contact form that sends messages to my Discord.

## Features

- **Modern Design**: Built with TailwindCSS for a clean layout.
- **Dynamic Contact Form**: Messages submitted through the form are forwarded to my Discord server.
- **Multiple Deployment Options**: Can be deployed as a Flask app with Docker or as a static site on Netlify.

## How It Works

The app can be deployed in two ways:

### Flask App (Docker)
- Powered by Flask and uses a Discord webhook to handle contact form submissions.
- Environment variables (stored in a `.env` file) are used for sensitive data like the app's secret key and the webhook URL.

### Static Site (Netlify)
- Static HTML/CSS/JavaScript with Netlify serverless functions.
- Discord webhook URL is stored in Netlify environment variables.
- No server required - runs entirely on Netlify's infrastructure.

## Deployment Options

### Option 1: Docker Deployment (Original Flask App)

You can build and run it with Compose:

```bash
docker-compose up --build
```

Make sure to set up your `.env` file with the following variables:
```
FLASK_SECRET_KEY=your_secret_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### Option 2: Netlify Deployment (Static Site)

1. **Push code to GitHub**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository
   - Publish directory: `.`

3. **Set environment variable:**
   - Go to Site settings → Environment variables
   - Add `DISCORD_WEBHOOK_URL` with your webhook URL

4. **Deploy:**
   - Netlify will automatically deploy and provide a URL

## File Structure

```
resume/
├── app.py                 # Flask application (Docker deployment)
├── index.html             # Static site (Netlify deployment)
├── templates/
│   └── resume.html        # Original Flask template
├── static/                # Images and assets
├── netlify/
│   └── functions/
│       └── contact.js     # Netlify serverless function
├── docker-compose.yml     # Docker configuration
├── Dockerfile             # Docker image
├── package.json           # Netlify dependencies
└── netlify.toml           # Netlify configuration
```

## Why I Built This

I wanted a personal splash page that could be deployed both locally with Docker and as a free static site on Netlify.

---

Feel free to reach out via the contact form!
