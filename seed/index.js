const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seedProjectType = require("./project_type.seed").seed;
const seedBuildingType = require("./building_type.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await seedProjectType(db);
  await seedBuildingType(db);
};

seed();
