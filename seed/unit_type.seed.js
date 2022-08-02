const uuid = require("uuid").v4;
const moment = require("moment");
const UNIT_TYPE_NULL_ATTRIBUTES =
  require("./constant").UNIT_TYPE_NULL_ATTRIBUTES;

const seed = async (db) => {
  const unitTypeCollection = await db.collection("unit_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Block",
        code: "BL",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Box",
        code: "BX",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cubic Feet",
        code: "C.F.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cubic Metre",
        code: "C.M.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Each",
        code: "EA",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Kilogram",
        code: "KG",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Linear Foot",
        code: "L.F.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Linear Metre",
        code:"L.M.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Lot",
        code: "LT",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Package",
        code: "PA",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Piece",
        code: "PC",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Pack",
        code: "PK",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Pair",
        code: "PR",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Pallet",
        code: "PF",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Plate",
        code: "PP",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Pound",
        code: "LB",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Rack",
        code: "RA",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Roll",
        code: "RL",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Sheet",
        code: "SH",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Set",
        code: "ST",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Square Feet",
        code: "S.F.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Square Metre",
        code: "S.M.",
        created_at: moment(),
      },
      {
        ...UNIT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Unit",
        code: "UT",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "unit_types",
        },
      });
    });
    console.log("success seed unit type data");
  };
  try {
    await createAndSeed(unitTypeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await unitTypeCollection.drop();
      await createAndSeed(unitTypeCollection);
    }
  }
};

module.exports = {
  seed,
};
