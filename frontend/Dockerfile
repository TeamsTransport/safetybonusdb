FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./
RUN npm ci

COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173
CMD ["npx", "vite", "--host"]
