FROM alpine:3.20.3

RUN apk add nodejs npm

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm install

CMD ["./node_modules/.bin/pm2-docker", "index.js", "--watch"]
