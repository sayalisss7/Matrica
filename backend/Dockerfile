FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for compiling some python packages like psycopg2)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project context (backend, data, etc.)
# We'll copy everything but rely on docker-compose for volume mapping if needed
COPY . .

# Expose port
EXPOSE 8000

# Set Python path so imports like `from backend...` work correctly
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
