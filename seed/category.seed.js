const uuid = require("uuid").v4;
const moment = require("moment");
const CATEGORY_NULL_ATTRIBUTES = require("./constant").CATEGORY_NULL_ATTRIBUTES;

const seed = async (db) => {
  const categoryCollection = await db.collection("categories");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...CATEGORY_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Architectural material",
        subs: [
          {
            id: uuid(),
            name: "Architectural Metal & Alloy",
            subs: [
              {
                id: uuid(),
                name: "Aluminum",
              },
              {
                id: uuid(),
                name: "Brass",
              },
              {
                id: uuid(),
                name: "Bronze",
              },
              {
                id: uuid(),
                name: "Cold/Hot Rolled Steel",
              },
            ],
          },
          {
            id: uuid(),
            name: "Natural Stone & Rock",
            subs: [
              {
                id: uuid(),
                name: "Basalt",
              },
              {
                id: uuid(),
                name: "Grannite",
              },
              {
                id: uuid(),
                name: "Limestone",
              },
              {
                id: uuid(),
                name: "Marble",
              },
            ],
          },
        ],
        created_at: moment(),
      },
      {
        ...CATEGORY_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Bathroom sanitary wares & fittings",
        subs: [
          {
            id: uuid(),
            name: "Normal",
            subs: [
              {
                id: uuid(),
                name: "Copper",
              },
              {
                id: uuid(),
                name: "Stainless Steel",
              },
            ],
          },
          {
            id: uuid(),
            name: "Luxury",
            subs: [
              {
                id: uuid(),
                name: "Sandstone",
              },
              {
                id: uuid(),
                name: "Travertine",
              },
              {
                id: uuid(),
                name: "Slate",
              },
            ],
          },
        ],
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "categories",
        },
      });
    });
    console.log("success seed category data");
  };
  try {
    await createAndSeed(categoryCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await categoryCollection.drop();
      await createAndSeed(categoryCollection);
    }
  }
};

module.exports = {
  seed,
};
