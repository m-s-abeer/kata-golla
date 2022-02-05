FROM node:16.13-alpine as build
WORKDIR /app/client
COPY ./client/package.json ./
COPY ./client/package-lock.json ./
RUN npm ci
COPY ./client ./
RUN npm run build

FROM node:16.13-alpine
WORKDIR /app/server
COPY ./server/package.json ./
COPY ./server/package-lock.json ./
RUN npm ci
COPY ./server ./
COPY --from=build /app/client/build /app/server/build

CMD ["npm", "start"]
