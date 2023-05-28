FROM node:lts-alpine

WORKDIR /src

COPY ./package.json ./package-lock.json /src/

RUN npm install --force

COPY . /app/

EXPOSE 3000

CMD ["npm", "run", "dev"]