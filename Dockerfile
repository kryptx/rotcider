FROM node:8-alpine AS base
COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn

FROM base AS copy
COPY . /app/

FROM copy AS test
RUN npm test
