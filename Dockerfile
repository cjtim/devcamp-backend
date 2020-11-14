# Multistage docker build
# Stage 1
FROM node:12-alpine AS BUILD_IMAGE
WORKDIR /usr/src/app
COPY . .
RUN yarn --frozen-lockfile

# Stage 2
FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY . .
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE ${PORT}

CMD ["yarn", "start"]
