const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();
const uuid = require("uuid").v4;
const moment = require("moment");
const FUNCTIONAL_TYPE_NULL_ATTRIBUTES =
  require("./constant").FUNCTIONAL_TYPE_NULL_ATTRIBUTES;
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const functionalTypeCollection = await db.collection("functional_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Business Office",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Headquarter",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Regional Office",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Local Office",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Experience Center",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Showroom & Gallery",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Customer & Service Center",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Factory & Fabrication Shop",
        created_at: moment(),
      },
      {
        ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Logistic Facility & Warehouse",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "functional_types",
        },
      });
    });
    console.log("success seed functional type data");
  };
  try {
    await createAndSeed(functionalTypeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await functionalTypeCollection.drop();
      await createAndSeed(functionalTypeCollection);
    }
  }
};

module.exports = {
  seed,
};
