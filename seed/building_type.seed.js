const uuid = require("uuid").v4;
const moment = require("moment");
const BUILDING_TYPE_NULL_ATTRIBUTES =
  require("./constant").BUILDING_TYPE_NULL_ATTRIBUTES;

const seed = async (db) => {
  const functionalTypeCollection = await db.collection("building_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Addition & Alteration",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Concept & Competition",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Conversation & Restoration",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Iterior Fit-out & Renovation",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Landscaping & Outdoorm Space",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Master & Urban Planning",
        created_at: moment(),
      },
      {
        ...BUILDING_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "New Building & Construction",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "building_types",
        },
      });
    });
    console.log("success seed building type data");
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
