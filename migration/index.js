const migrate_table = require("./migrate_template").migrate;

const migrate = async () => {
  await migrate_table("roles");
  await migrate_table("users");
  await migrate_table("permissions");
  await migrate_table("permission_details");
  await migrate_table("documentations");
  await migrate_table("brands");
  await migrate_table("designers");
  await migrate_table("category_basis_attributes");
  await migrate_table("collections");
  await migrate_table("products");
};

migrate();
