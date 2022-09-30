const migrate_table = require("./migrate_template").migrate;

const migrate = async () => {
  await migrate_table("roles");
  await migrate_table("users");
  await migrate_table("permission_routes");
  await migrate_table("permissions");
  await migrate_table("documentations");
  await migrate_table("brands");
  await migrate_table("designers");
  await migrate_table("categories");
  await migrate_table("bases");
  await migrate_table("attributes");
  await migrate_table("collections");
  await migrate_table("products");
  await migrate_table("departments");
  await migrate_table("locations");
  await migrate_table("product_downloads");
  await migrate_table("product_tips");
  await migrate_table("inspirational_quotations");
  await migrate_table("email_autoresponders");
  await migrate_table("distributors");
  await migrate_table("market_availabilities");
  await migrate_table("product_catelogue_n_downloads");

  await migrate_table("countries");
  await migrate_table("states");
  await migrate_table("cities");

  await migrate_table("projects");
  await migrate_table("project_zones");

  await migrate_table("considered_products");
  await migrate_table("material_codes");
  await migrate_table("specified_products");
  await migrate_table("contacts");
  await migrate_table("common_types");

  await migrate_table("user_product_specifications");
  await migrate_table("project_products");
};

migrate();
