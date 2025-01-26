
# resume

This is a simple web app I created as a personal splash page and to provide an easy way for people to contact me. The page includes:

- A brief summary of my background.
- A list of technical skills.
- Links to my GitHub and LinkedIn profiles.
- A contact form that sends messages to my Discord.

## Features

- **Modern Design**: Built with TailwindCSS for a clean layout.
- **Dynamic Contact Form**: Messages submitted through the form are forwarded to my Discord server.
- **Dockerized Deployment**: The app is fully containerized, making it easy to deploy anywhere.

## How It Works

1. The app is powered by Flask and uses a Discord webhook to handle contact form submissions.
2. Environment variables (stored in a `.env` file) are used for sensitive data like the app's secret key and the webhook URL.

## Deployment

You can build and run it with Compose:

```bash
docker-compose up --build
```

Make sure to set up your `.env` file with the following variables:
```
FLASK_SECRET_KEY=your_secret_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## Why I Built This

I wanted a personal splash page.

---

Feel free to reach out via the contact form!
