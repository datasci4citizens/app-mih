# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

# VITE_* vars are baked into the JS bundle at build time (client-side).
# Pass them with --build-arg; defaults point at the prod cluster backend.
ARG VITE_SERVER_URL=https://server-mih.ak8s.ic.unicamp.br
ARG VITE_GOOGLE_CLIENT_ID=
ARG VITE_DEV_MODE=false
ENV VITE_SERVER_URL=$VITE_SERVER_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_DEV_MODE=$VITE_DEV_MODE

COPY package.json package-lock.json ./
# @capacitor/app@8 declares peer core>=8 while the app pins core@7; lock is
# already resolved, so skip the strict peer check to match local installs.
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
