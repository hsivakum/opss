FROM node:18-alpine

WORKDIR /opss/
COPY public/ /opss/public
COPY src/ /opss/src
COPY package.json /opss/

RUN npm install --force

EXPOSE 3000

CMD ["npm", "start"]