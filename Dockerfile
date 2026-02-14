FROM node:18-alpine

WORKDIR /app

COPY careops-backend/package*.json ./

RUN npm install

COPY careops-backend/ .

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
