# TISC Backend API with HapiJS + ArangoDB + Sendinblue + DO Spaces

===========================

## Requirements

- NodeJS > 14.17.x
- NPM > 6.14.x

## Documentation

### Dev Enviroment

- copy `.env_example` to `.env` and correct enviroments.
- Run `npm install`.
- Run `npm run dev`.

### Available scripts

- `dev`: Starts node in dev enviroment
- `create:database`: Create database with name in dev enviroment
- `make:migration`: Create migration files
- `make:seed`: Create seed files
- `db:migrate`: Migrate all tables
- `db:seed`: Execute all seed file
- `test`: Run unit test


### Deployment
#### Docker
1. Build with docker files
    - RUN `docker build . -t <image_name>:<image_tag>` in root folder
2. Test image
    - Set `PORT=80` in `.env`, (image will expose port 80)
    - Update `docker-compose.yml` in `docker` folders and run the docker
