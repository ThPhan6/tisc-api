const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seed1 = require("./permission_route.seed").seed;
const seed2 = require("./permission.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await seed1(db);
  await seed2(db);
};

seed();
