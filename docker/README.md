# TRACELIUM DOCKER PRODUCTION

### Change API enviroment
1. Copy `.env.production` ti `.env` and change enviroments if needed

### NGINX gateway configuration
1. Correct `server_name` for both `React Frontpage` & `Backend API`

### Database Setup (Kubernetes jobs) - One time
1. Exec to container `tracelium_api` by `docker exec -ti tracelium_api /bin/sh`;
2. Run `./node_modules/.bin/knex migrate:latest`
3. Run `./node_modules/.bin/knex seed:run`

### Database Backup (Kubernetes jobs)
> Backup API only can be called from inside container `tracelium_api`
API: `/backup`

### Notes
1. Image `tuanes/tracelium-frontpage:2.0.0` API url is `https://api.tracelium.com` if you want to change it we need to rebuild the image again
2. Version 1.1 is for development only
