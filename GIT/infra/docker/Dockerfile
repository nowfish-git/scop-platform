# SCOP 通用微服务 Dockerfile
# 用法: docker build -t scop/<service-name>:<tag> -f infra/docker/Dockerfile --build-arg SERVICE=<service-name> .

ARG SERVICE=user-svc

# ---- 依赖阶段 ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/${SERVICE}/package.json ./apps/${SERVICE}/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --filter ./apps/${SERVICE}...

# ---- 构建阶段 ----
FROM node:20-alpine AS build
ARG SERVICE
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @scop/${SERVICE} build

# ---- 运行阶段 ----
FROM node:20-alpine AS runtime
ARG SERVICE
ENV NODE_ENV=production \
    SERVICE=${SERVICE}
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/${SERVICE}/package.json ./apps/${SERVICE}/
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/${SERVICE}/dist ./apps/${SERVICE}/dist
RUN pnpm install --frozen-lockfile --filter ./apps/${SERVICE}... --prod

WORKDIR /app/apps/${SERVICE}
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
