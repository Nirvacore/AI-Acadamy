FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM caddy:2.10-alpine
COPY --from=builder /app/out /srv
COPY deploy/netcup/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
