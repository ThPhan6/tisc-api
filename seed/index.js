const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;
const seedPermissionDetail =
  require("./permission_detail.seed").seedPermissionDetail;

const seed = async () => {
  await seedRole();
  await seedUser();
  await seedPermission();
  setTimeout(() => {
    seedPermissionDetail();
  }, 4000);
};

seed();
