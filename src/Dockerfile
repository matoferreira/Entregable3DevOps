FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

FROM node:16-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --production --omit=dev

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]