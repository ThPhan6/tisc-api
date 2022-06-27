# TISC Backend API with HapiJS + ArangoDB + Sendinblue + DO Spaces

===========================

## Requirements

- NodeJS > 14.16.x
- NPM > 6..14.x

## Documentation

### Dev Enviroment

- copy `.env_example` to `.env`.
- Run `npm install`.
- Run `npm run dev`.

### Available scripts

- `dev`: Starts node in dev enviroment
- `create_db`: Create database with name in dev enviroment
- `migrate`: Migrate all tables
- `seed`: Execute all seed file
- `test`: Run unit test

### Run unit test
- Edit env DATABASE_HOSTNAME, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD.
- If database is not exist, run script `create_db`, `migrate` and `seed`. If not, ignore this step.
- Run script `test`.