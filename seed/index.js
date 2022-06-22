// const seedRole = require("./role.seed").seedRole;
// const seedUser = require("./user.seed").seedUser;
// const seedPermission = require("./permission.seed").seedPermission;
const seedDesign = require("./designer.seed").seed;
const seedDepartment = require("./department.seed").seed;
const seedBasis = require("./basis.seed").seed;

const seed = async () => {
  // await seedRole();
  // await seedUser();
  // await seedPermission();
  // await seedDepartment();
  // await seedBasis();
  await seedDesign();
};

seed();
