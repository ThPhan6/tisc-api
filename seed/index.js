const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;
const seedDesigner = require("./designer.seed").seedDesigner;

const seed = async () => {
  // await seedRole();
  // await seedUser();
  // await seedPermission();
  await seedDesigner();
};

seed();
