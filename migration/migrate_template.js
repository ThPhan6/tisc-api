const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const migrate = async (name) => {
  const collection = await db.collection(name);
  try {
    await collection.create();
    await collection.get();
    console.log(`migrated ${name} table`);
  } catch (error) {
    // console.log(error.message);
    if (error.message === "duplicate name") {
      await collection.get();
      console.log(`table ${name} is exists`);
    }
  }
};

module.exports = {
  migrate,
};
