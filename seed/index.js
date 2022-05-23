const seedRole = require("./role.seed").seedRole;
const seedUser = require("./user.seed").seedUser;
const seedPermission = require("./permission.seed").seedPermission;

seedRole();
seedUser();
seedPermission();
