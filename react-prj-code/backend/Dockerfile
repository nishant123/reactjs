FROM node:12.18.2

WORKDIR /code

ENV PORT 3000

COPY package.json /code/package.json

RUN npm install

COPY . /code

CMD ["node", "app.js"]