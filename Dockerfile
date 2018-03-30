FROM node:8-alpine AS base
COPY package.json yarn.lock /
RUN yarn

FROM base AS copy
COPY . /
RUN npm run test:ci
EXPOSE 3000
CMD node .
