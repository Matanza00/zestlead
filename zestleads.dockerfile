# =========================
# Stage 1 — deps (install & prisma generate)
# =========================
FROM node:20-alpine AS deps
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Needed for native deps like bcrypt (node-gyp toolchain)
RUN apk add --no-cache libc6-compat python3 make g++ pkgconfig openssl

COPY package*.json ./
COPY prisma ./prisma

# Install all deps (prod+dev) for build, and generate Prisma client
RUN npm ci
RUN npx prisma generate

# =========================
# Stage 2 — builder (Next build)
# =========================
FROM node:20-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# If you rely on PUBLIC vars at build-time, pass them as build args or provide .env.production
RUN npm run build

# =========================
# Stage 3 — runner (small, prod-only)
# =========================
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Ship only what we need to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/prisma ./prisma
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

# Cloud Run will set $PORT; we default to 8080
ENV PORT=8080
EXPOSE 8080

# Start Next on the provided port
CMD ["npm", "run", "start"]
