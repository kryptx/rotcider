FROM node:8-alpine AS base
COPY package.json yarn.lock /
RUN yarn

FROM base AS copy
COPY . /

FROM copy AS test
RUN npm test

FROM copy
EXPOSE 3000
CMD node .
