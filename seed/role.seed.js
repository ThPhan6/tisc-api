const moment = require("moment");
const ROLES = require("./constant").ROLES;

const seed = async (db) => {
  const roleCollection = await db.collection("roles");
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
    await createAndSeed(roleCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await roleCollection.drop();
      await createAndSeed(roleCollection);
    }
  }
};

module.exports = {
  seed,
};
