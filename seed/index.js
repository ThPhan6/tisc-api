const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seedUnitType = require("./unit_type.seed").seed;
const seedRequirementType = require("./requirement_type.seed").seed;
const commonTypes = require("./common_type.seed").seed;
const seedRole = require("./role.seed").seed;
const seedDocument = require("./documentation.seed").seed;
const seedInstructionType = require("./instruction_type.seed").seed;
const seedAutoEmail = require("./auto_email").seed;
const seedCategory = require("./category.seed").seed;
const seedBasis = require("./basis.seed").seed;
const seedBrand = require("./brand.seed").seed;
const seedBuildingType = require("./building_type.seed").seed;
const seedProjectType = require("./project_type.seed").seed;
const seedUser = require("./user.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await commonTypes(db);
  await seedRequirementType(db);
  await seedInstructionType(db);
  await seedUnitType(db);
  await seedRole(db);
  await seedDocument(db);
  await seedAutoEmail(db);
  await seedCategory(db);
  await seedBasis(db);
  await seedBrand(db);
  await seedBuildingType(db);
  await seedProjectType(db);
  await seedUser(db);
};

seed();
