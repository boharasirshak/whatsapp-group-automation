sudo apt-get update
sudo apt-get upgrade -y

sudo apt-get update && apt-get install -y wget --no-install-recommends \
    && apt-get install -y libxshmfence1 libxrandr2 libxfixes3 libxcursor1 libxdamage1 libxi6 \
    libxtst6 libnss3 libcups2 libxss1 libxcomposite1 libasound2 libpangocairo-1.0-0 libatk1.0-0 \
    libatk-bridge2.0-0 libgtk-3-0 && rm -rf /var/lib/apt/lists/*
