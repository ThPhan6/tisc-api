const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;
const seedEmailAuto = require("./email_auto").seedEmailAuto;
const seed = async () => {
  await seedRole();
  await seedUser();
  await seedPermission();
  await seedEmailAuto();
};

seed();
