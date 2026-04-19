# Build stage: compile the application with dev dependencies available.
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

# Runtime stage: keep only production dependencies and runtime assets.
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=prod

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/not_found.jpg ./not_found.jpg
RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app

USER node

CMD [ "node", "dist/src/main.js" ]
