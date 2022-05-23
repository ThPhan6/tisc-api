const { Database } = require("arangojs");
const dotenv = require("dotenv");
const moment = require("moment");
dotenv.config();

const ROLES = {
  TISC_ADMIN: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  TISC_CONSULTANT_TEAM: "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
  BRAND_ADMIN: "62ad5077-6183-435e-97f8-81c35065504e",
  BRAND_TEAM: "c93584c7-7987-4be0-aa7d-e48e20960630",
  DESIGNER_ADMIN: "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  DESIGNER_TEAM: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
};

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
        id: ROLES.DESIGNER_ADMIN,
        name: "Design admin",
        created_at: moment(),
      },
      {
        id: ROLES.DESIGNER_TEAM,
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
