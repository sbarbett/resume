# Dockerfile

# Use Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir flask python-dotenv requests flask-limiter

# Expose the Flask port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
