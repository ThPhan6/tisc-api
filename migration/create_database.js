const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
const database_name = process.env.DATABASE_NAME || "";
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
db.listDatabases().then((names) => {
  const check = names.find((name) => name === database_name);
  if (check) {
    db.useDatabase(database_name);
    db.get().then(
      () => console.log("Using database " + database_name),
      (error) => console.error("Error connecting to database: " + error)
    );
  } else {
    db.createDatabase(database_name).then(
      () => console.log("Database created successfully: " + database_name),
      (error) => console.error("Error creating database: " + error)
    );
  }
});
