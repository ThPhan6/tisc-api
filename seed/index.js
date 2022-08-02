const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seedUnitType = require("./unit_type.seed").seed;
const seedRequirementType = require("./requirement_type.seed").seed;
const seedInstructionType = require("./instruction_type.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await seedUnitType(db);
  await seedRequirementType(db);
  await seedInstructionType(db);
};

seed();
