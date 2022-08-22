const uuid = require("uuid").v4;
const moment = require("moment");
const COMMON_TYPES_ATTRIBUTES = require("./constant").COMMON_TYPES_ATTRIBUTES;
const COMMON_TYPES = require("./constant").COMMON_TYPES;


const seed = async (db) => {
  const commonTypeCollection = await db.collection("common_types");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Architects/Interior Designers",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Builders/Contractors",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Clients/Customers",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Distributors/Sales Agents",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Internal Team Members",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Other Professional Consultants",
        type: COMMON_TYPES.SHARING_GROUP,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Approval/Confirmation",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Comment/Feedback",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "General Review/Sharing",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Internal Evaluation/Discussion",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Project Proposal/Submission",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
      {
        ...COMMON_TYPES_ATTRIBUTES,
        id: uuid(),
        name: "Recommendation/Suggestion",
        type: COMMON_TYPES.SHARING_PURPOSE,
        created_at: moment(),
      },
    ];

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
