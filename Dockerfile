FROM node:14 AS base
COPY package.json yarn.lock /
RUN yarn --frozen-lockfile

FROM base AS copy
COPY . /

EXPOSE 3000
CMD node .
