ARG NODE_VERSION=23

FROM node:${NODE_VERSION}-alpine AS builder 

WORKDIR /usr/src/app

COPY prisma/ ./prisma

COPY package.json .
COPY package-lock.json .

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

COPY . .

ARG DATABASE_URL=""
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate 

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app  .

EXPOSE 3000

CMD ["npm", "run", "start"]
