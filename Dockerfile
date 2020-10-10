FROM node:12.18.3

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install --no-optional && npm cache clean --force
ENV PATH /usr/src/app/node_modules/.bin:$PATH

ENV HOST=0.0.0.0 PORT=8080

EXPOSE ${PORT}

CMD ["ts-node", "./src/index.ts"]
