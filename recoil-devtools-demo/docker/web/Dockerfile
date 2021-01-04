FROM node:12.18 as development
WORKDIR /usr/src/app
COPY . .
RUN yarn
EXPOSE 8091
CMD [ "yarn", "dev" ]


FROM development as builder
WORKDIR /usr/src/app
COPY . .
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
RUN yarn && yarn build


FROM nginx:1.13.12-alpine as production
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY docker/web/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
