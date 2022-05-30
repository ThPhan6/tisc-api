const documentationMigrate =
  require("./1_create_documentation_table").documentationMigrate;

const migrate = async () => {
  await documentationMigrate();
};

migrate();
