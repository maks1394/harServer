FROM node:18.18.2-alpine3.18

WORKDIR /app

COPY . .

RUN yarn install

# EXPOSE 1394

CMD node bin/run "$(ls currentHar/*.har | head -n 1)" .
