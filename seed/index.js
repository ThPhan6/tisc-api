const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seed1 = require("./permission_route.seed").seed;
const seed2 = require("./permission.seed").seed;

const seedRole = require("./role.seed").seed;
const seedUser = require("./user.seed").seed;
const seedPermission = require("./permission.seed").seed;
const seedBrand = require("./brand.seed").seed;
const seedBasis = require("./basis.seed").seed;
const seedPermissionRoute = require("./permission_route.seed").seed;
const seedAutoEmail = require("./auto_email").seed;
const seedFunctionalType = require("./functional_type.seed").seed;
const seedDocumentation = require("./documentation.seed").seed;
const seedDepartment = require("./department.seed").seed;
const seedDesigner = require("./designer.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  // await seedDocumentation(db);
  // await seedRole(db);
  // await seedUser(db);
  // await seedPermission(db);
  // await seedPermissionRoute(db);
  await seedBrand(db);
  // await seedBasis(db);
  // await seedAutoEmail(db);
  // await seedFunctionalType(db);
  // await seedDepartment(db);
  // await seedDesigner(db);
  // await seed1(db);
  // await seed2(db);
};

seed();
