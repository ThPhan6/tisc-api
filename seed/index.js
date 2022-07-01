const seedRoute = require("./permission_route.seed").seed;
const seedPermission = require("./permission.seed").seed;
const seed = async () => {
  await seedRoute();
  await seedPermission();
};

seed();
