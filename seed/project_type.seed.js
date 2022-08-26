const uuid = require("uuid").v4;
const moment = require("moment");
const PROJECT_TYPE_NULL_ATTRIBUTES =
  require("./constant").PROJECT_TYPE_NULL_ATTRIBUTES;

const seed = async (db) => {
  const functionalTypeCollection = await db.collection("project_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Airport, Station, Transportation Hub",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Apartment, Condo, Multi-unit Housing",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Arena, Sports Hall, Stadium",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Bank Building, High-Security Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Club, Entertainment, Gaming Complex",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cultural Space, Gallery, Museum",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Commerce, Retail Store, Shopping Mall",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Data Center, IT Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Distribution Center, Factory, Warehouse",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Educational Space, Library, School",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Food & Beverage, Hospitality Outlet",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Government, Institutional Building",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Healthcare, Hospital, Medical Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Hotel, Resort, Motel, Lodging Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Landscaping, Park, Playground",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Meetings, Incentives, Conferences, Exhibitions",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Mixed-Use Development",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Office Building, Workplace Space",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Prison, Confinement Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Public Space, Monument, Open Plaza",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Religion Building, Worship Facility",
        created_at: moment(),
      },
      {
        ...PROJECT_TYPE_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Single House, Private Residence",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "project_types",
        },
      });
    });
    console.log("success seed project type data");
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
