const uuid = require("uuid").v4;
const moment = require("moment");
const REQUIREMENT_TYPE_NULL_ATTRIBUTES =
  require("./constant").REQUIREMENT_TYPE_NULL_ATTRIBUTES;

const seed = async (db) => {
  const instructionTypeCollection = await db.collection("instruction_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Image included for reference only",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Refer to control sample for actual finish",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Product conforms to code and regulation",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Product conforms to industry standards",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "instruction_types",
        },
      });
    });
    console.log("success seed instruction type data");
  };
  try {
    await createAndSeed(instructionTypeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await instructionTypeCollection.drop();
      await createAndSeed(instructionTypeCollection);
    }
  }
};

module.exports = {
  seed,
};
