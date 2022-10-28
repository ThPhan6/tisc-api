const { Database } = require("arangojs");
const dotenv = require("dotenv");
const seedRole = require("./role.seed").seed;
const seedDocument = require("./documentation.seed").seed;
const seedAutoEmail = require("./auto_email").seed;
const seedCategory = require("./category.seed").seed;
const seedPermission = require("./permission.seed").seed;
const seedUser = require("./user.seed").seed;
const seedCommonType = require("./common_types.seed").seed;
const templateSeed = require("./template.seed").seed;
const seedBasis = require("./basis.seed").seed;

dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});

db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  await seedRole(db);
  await seedDocument(db);
  await seedAutoEmail(db);
  await seedCategory(db);
  await seedPermission(db);
  await seedUser(db);
  await templateSeed(db);
  await seedCommonType(db);
  await seedBasis(db);
};

seed();
