FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts

COPY src ./src
EXPOSE 3001
ENV PORT=3001
ENV CORS_ORIGIN=http://localhost:3000
CMD ["node", "src/index.js"]
