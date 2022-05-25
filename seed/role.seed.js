const { Database } = require("arangojs");
const dotenv = require("dotenv");
const moment = require("moment");
const ROLES = require('./constant').ROLES
dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const collection = await db.collection("roles");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        id: ROLES.TISC_ADMIN,
        name: "TISC admin",
        created_at: moment(),
      },
      {
        id: ROLES.TISC_CONSULTANT_TEAM,
        name: "TISC consultant team",
        created_at: moment(),
      },
      {
        id: ROLES.BRAND_ADMIN,
        name: "Brand admin",
        created_at: moment(),
      },
      {
        id: ROLES.BRAND_TEAM,
        name: "Brand team",
        created_at: moment(),
      },
      {
        id: ROLES.DESIGN_ADMIN,
        name: "Design admin",
        created_at: moment(),
      },
      {
        id: ROLES.DESIGN_TEAM,
        name: "Design team",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "roles",
        },
      });
    });
    console.log("success seed role data");
  };
  try {
    await createAndSeed(collection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await collection.drop();
      await createAndSeed(collection);
    }
  }
};

module.exports = {
  seedRole: seed,
};
