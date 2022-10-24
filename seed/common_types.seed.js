const uuid = require("uuid").v4;
const moment = require("moment");

const COMMON_TYPES_ATTRIBUTES = require("./constant").COMMON_TYPES_ATTRIBUTES;

const COMMON_TYPE_JSON = require("./jsons/common_type.json");
const seed = async (db) => {
  const commonTypeCollection = await db.collection("common_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();

    const records = COMMON_TYPE_JSON.map((item) => ({
      ...COMMON_TYPES_ATTRIBUTES,
      id: uuid(),
      type: item.type,
      name: item.name,
      created_at: moment(),
    }));

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "common_types",
        },
      });
    });
    console.log("success seed common type data");
  };
  try {
    await createAndSeed(commonTypeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await commonTypeCollection.drop();
      await createAndSeed(commonTypeCollection);
    }
  }
};

module.exports = {
  seed,
};
