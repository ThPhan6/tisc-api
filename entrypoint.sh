#/bin/sh
yarn db:migrate
yarn db:seed
node /var/www/dist/server.js
