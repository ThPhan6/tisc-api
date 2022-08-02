const uuid = require("uuid").v4;
const moment = require("moment");
const REQUIREMENT_TYPE_NULL_ATTRIBUTES =
  require("./constant").REQUIREMENT_TYPE_NULL_ATTRIBUTES;

const seed = async (db) => {
  const requirementTypeCollection = await db.collection("requirement_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cutting",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Finishing Sample",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Flame Certificate",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "LEED Certificate",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Prototype",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Seaming Diagram",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Shop Drawings",
        created_at: moment(),
      },
      {
        ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Strike-off",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "requirement_types",
        },
      });
    });
    console.log("success seed requirement type data");
  };
  try {
    await createAndSeed(requirementTypeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await requirementTypeCollection.drop();
      await createAndSeed(requirementTypeCollection);
    }
  }
};

module.exports = {
  seed,
};
