const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seedCountry = require("./country").seed;
const seedState = require("./state").seed;
const seedCity = require("./city").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await seedCountry(db);
  await seedState(db);
  await seedCity(db);
};

seed();
