FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install

RUN npm install react-router-dom@6.8.1


COPY . .

EXPOSE 3000

CMD ["npm", "start"]
