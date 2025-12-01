FROM node:24-alpine

WORKDIR /usr/src/app

# Inštaluj závislosti
COPY package*.json ./
RUN npm install

# Kopíruj kód (bind mount bude prepísať)
COPY . .

# Expose port Vite
EXPOSE 5173

# Spusti dev server s hot-reload
CMD ["npm", "run", "dev", "--", "--host"]
