FROM python:3.11-slim

# System deps for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Default env (override in docker-compose)
ENV DB_HOST=userdb \
    DB_PORT=5432 \
    DB_NAME=userdb \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    KAFKA_BROKER=kafka:9092 \
    LOG_LEVEL=INFO \
    RUN_NOW=false

CMD ["python", "main.py"]