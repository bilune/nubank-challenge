FROM node:16.12.0-slim

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]