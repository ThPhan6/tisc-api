const roleMigrate = require("./20220530051914_create_role_table").migrate;
const userMigrate = require("./20220530051954_create_user_table").migrate;
const permissionMigrate =
  require("./20220530052011_create_permission_table").migrate;
const permissionDetailMigrate =
  require("./20220530052027_create_permission_detail_table").migrate;
const documentationMigrate =
  require("./20220530052049_create_documentation_table").migrate;
const brandMigrate = require("./20220530052103_create_brand_table").migrate;
const designerMigrate =
  require("./20220530052115_create_designer_table").migrate;

const migrate = async () => {
  await roleMigrate();
  await userMigrate();
  await permissionMigrate();
  await permissionDetailMigrate();
  await documentationMigrate();
  await brandMigrate();
  await designerMigrate();
};

migrate();
