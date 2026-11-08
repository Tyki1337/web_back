
# =========================
# Stage 1: Build
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and Prisma configuration
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile NestJS
RUN npm run build


# =========================
# Stage 2: Production
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy compiled application
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
