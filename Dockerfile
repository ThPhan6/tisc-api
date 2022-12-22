FROM node:14.17.0

COPY ./ /var/www/
RUN chmod +x /var/www/entrypoint.sh

WORKDIR /var/www/
RUN yarn && yarn build

ENV HOST=localhost
ENV PORT=80
ENV NODE_ENV=production

EXPOSE 80

ENTRYPOINT ["sh", "/var/www/entrypoint.sh"]
