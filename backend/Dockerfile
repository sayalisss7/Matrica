FROM ubuntu:22.04

WORKDIR /app

# Prevent interactive prompts during apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install Ubuntu system dependencies and Python 3.10
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip3 install --no-cache-dir -r requirements.txt

# Copy only the necessary backend files to avoid bloated 9GB images
COPY backend/ ./backend/
COPY data/ ./data/

# Expose port
EXPOSE 8000

# Set Python path so imports like `from backend...` work correctly
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
