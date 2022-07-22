const uuid = require("uuid").v4;
const moment = require("moment");
const DEPARTMENT_NULL_ATTRIBUTES =
  require("./constant").DEPARTMENT_NULL_ATTRIBUTES;

const seed = async (db) => {
  const departmentCollection = await db.collection("departments");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Accounting/Finance",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Communication & PR",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Corporate & Management",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Client/Customer Service",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Design & Creativity",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Human Resource",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Legal & Advisory",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Marketing & Sales",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Operation & Project Management",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Production & Manufacturing",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Research & Development",
        created_at: moment(),
      },
      {
        ...DEPARTMENT_NULL_ATTRIBUTES,
        id: uuid(),
        name: "3rd Party & External Consultant",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "departments",
        },
      });
    });
    console.log("success seed deparment data");
  };
  try {
    await createAndSeed(departmentCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await departmentCollection.drop();
      await createAndSeed(departmentCollection);
    }
  }
};

module.exports = {
  seed,
};
