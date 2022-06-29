const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;
const seedAutoEmail = require("./auto_email").seedAutoEmail;
const seed = async () => {
  await seedRole();
  await seedUser();
  await seedPermission();
  await seedAutoEmail();
};

seed();
