const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;

const seed = async () => {
  await seedRole();
  await seedUser();
  await seedPermission();
};

seed();
