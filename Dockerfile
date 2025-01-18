FROM node:lts-alpine

ARG ARG_API_ENDPOINT=https://pre-mvp-api.ebtex.dev
ENV API_ENDPOINT=${ARG_API_ENDPOINT}

USER node
WORKDIR /home/node

COPY --chown=node package*.json ./
COPY ./patches ./patches
RUN npm ci

COPY --chown=node . .

RUN npm run build

EXPOSE 3000

CMD ["node_modules/pm2/bin/pm2-runtime", "start", "ecosystem.config.cjs"]
