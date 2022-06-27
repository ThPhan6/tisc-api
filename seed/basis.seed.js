const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();
const uuid = require("uuid").v4;
const moment = require("moment");
const BASIS_NULL_ATTRIBUTES = require("./constant").BASIS_NULL_ATTRIBUTES;
const BASIS_TYPES = require("./constant").BASIS_TYPES;
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const basisCollection = await db.collection("bases");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.CONVERSION,
        name: "Length",
        subs: [
          {
            id: uuid(),
            name_1: "Milimeter",
            name_2: "Inch",
            formula_1: "25.4",
            formula_2: "0.0393701",
            unit_1: "mm",
            unit_2: "in",
          },
          {
            id: uuid(),
            name_1: "Centimeter",
            name_2: "Inch",
            formula_1: "2.54",
            formula_2: "0.393701",
            unit_1: "cm",
            unit_2: "in",
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.CONVERSION,
        name: "Weight",
        subs: [
          {
            id: uuid(),
            name_1: "Kilogram",
            name_2: "Gram",
            formula_1: "1000",
            formula_2: "0.001",
            unit_1: "kg",
            unit_2: "g",
          },
          {
            id: uuid(),
            name_1: "Gram",
            name_2: "Kilogram",
            formula_1: "0.001",
            formula_2: "1000",
            unit_1: "g",
            unit_2: "kg",
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.CONVERSION,
        name: "Temperature",
        subs: [
          {
            id: uuid(),
            name_1: "Celsius",
            name_2: "Fahrenheit",
            formula_1: "33.8",
            formula_2: "-17.2",
            unit_1: "C",
            unit_2: "F",
          },
          {
            id: uuid(),
            name_1: "Fahrenheit",
            name_2: "Celsius",
            formula_1: "-17.2",
            formula_2: "33.8",
            unit_1: "F",
            unit_2: "C",
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.PRESET,
        name: "Material classification",
        subs: [
          {
            id: uuid(),
            name: "Natural stone",
            subs: [
              {
                id: uuid(),
                value_1: "Basalt",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Granite",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Limestone",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Marble",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
            ],
          },
          {
            id: uuid(),
            name: "Metal alloy",
            subs: [
              {
                id: uuid(),
                value_1: "Onyx",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Porphyry",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Quartzite",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Sandstone",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Slate",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
            ],
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.PRESET,
        name: "Standard ratings",
        subs: [
          {
            id: uuid(),
            name: "Natural stone",
            subs: [
              {
                id: uuid(),
                value_1: "Basalt",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Granite",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
            ],
          },
          {
            id: uuid(),
            name: "Metal alloy",
            subs: [
              {
                id: uuid(),
                value_1: "Onyx",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Porphyry",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
              {
                id: uuid(),
                value_1: "Quartzite",
                value_2: "",
                unit_1: "",
                unit_2: "",
              },
            ],
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.OPTION,
        name: "Stone standard thickness",
        subs: [
          {
            id: uuid(),
            name: "Title format",
            subs: [
              {
                id: uuid(),
                value_1: "6.4",
                value_2: "1/4",
                unit_1: "mm",
                unit_2: "inch",
              },
              {
                id: uuid(),
                value_1: "9.5",
                value_2: "3/8",
                unit_1: "mm",
                unit_2: "inch",
              },
              {
                id: uuid(),
                value_1: "12.7",
                value_2: "1/2",
                unit_1: "mm",
                unit_2: "inch",
              },
              {
                id: uuid(),
                value_1: "15.9",
                value_2: "5/8",
                unit_1: "mm",
                unit_2: "inch",
              },
            ],
          },
          {
            id: uuid(),
            name: "Slab format",
            subs: [
              {
                id: uuid(),
                value_1: "9.5",
                value_2: "3/8",
                unit_1: "mm",
                unit_2: "inch",
              },
              {
                id: uuid(),
                value_1: "12.7",
                value_2: "1/2",
                unit_1: "mm",
                unit_2: "inch",
              },
            ],
          },
        ],
        created_at: moment(),
      },
      {
        ...BASIS_NULL_ATTRIBUTES,
        id: uuid(),
        type: BASIS_TYPES.OPTION,
        name: "Stone edge profiles",
        subs: [
          {
            id: uuid(),
            name: "Title format",
            subs: [
              {
                id: uuid(),
                value_1: "6.4",
                value_2: "1/4",
                unit_1: "mm",
                unit_2: "inch",
              },
              {
                id: uuid(),
                value_1: "9.5",
                value_2: "3/8",
                unit_1: "mm",
                unit_2: "inch",
              },
            ],
          },
          {
            id: uuid(),
            name: "Slab format",
            subs: [
              {
                id: uuid(),
                value_1: "9.5",
                value_2: "3/8",
                unit_1: "mm",
                unit_2: "inch",
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
          "@model": "bases",
        },
      });
    });
    console.log("success seed basis data");
  };
  try {
    await createAndSeed(basisCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await basisCollection.drop();
      await createAndSeed(basisCollection);
    }
  }
};

module.exports = {
  seed,
};
