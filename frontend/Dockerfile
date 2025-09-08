FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm install -g tailwindcss

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173
CMD ["npx", "vite", "--host"]
