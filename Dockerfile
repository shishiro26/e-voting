ARG NODE_VERSION=23

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /usr/src/app

# Copy built app from the builder stage
COPY --from=builder /usr/src/app .

# Add and prepare the entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
