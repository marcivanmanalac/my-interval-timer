# Stage 1: Build Client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Copy built client to server static directory
# We need to ensure the server knows where to look. 
# index.js looks for '../client/dist' relative to __dirname.
# So if server is in /app, index.js is /app/index.js.
# It looks in /app/../client/dist -> /client/dist.
# So we should put the dist at /client/dist.
COPY --from=client-build /app/client/dist /client/dist

ENV PORT=3000
EXPOSE 3000

# Volume for data
VOLUME /app/data

CMD ["node", "index.js"]
