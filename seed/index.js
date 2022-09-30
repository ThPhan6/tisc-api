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
const seedPermission = require("./permission.seed").seed;
const seedPermissionRoute = require("./permission_route.seed").seed;
const seedBuildingType = require("./building_type.seed").seed;
const seedProjectType = require("./project_type.seed").seed;
const seedFunctionType = require("./functional_type.seed").seed;
const seedUser = require("./user.seed").seed;
const seedFinishScheduleFor = require("./finish_schedule_for.seed").seed;
const seedCommonType = require("./common_types.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  // await commonTypes(db);
  // await seedRequirementType(db);
  // await seedInstructionType(db);
  // await seedUnitType(db);
  // await seedRole(db);
  // await seedDocument(db);
  // await seedAutoEmail(db);
  // await seedCategory(db);
  await seedPermission(db);
  // await seedPermissionRoute(db);
  // await seedFunctionType(db);
  // await seedBuildingType(db);
  // await seedProjectType(db);
  // await seedUser(db);
  // await seedFinishScheduleFor(db);
  // await seedCommonType(db);
};

seed();
