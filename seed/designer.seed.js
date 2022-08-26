const uuid = require("uuid").v4;
const moment = require("moment");
const DESIGN_NULL_ATTRIBUTES = require("./constant").DESIGN_NULL_ATTRIBUTES;
const DESIGN_STATUSES = require("./constant").DESIGN_STATUSES;

const seed = async (db) => {
  const designerCollection = await db.collection("designers");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...DESIGN_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Veteran Design",
        parent_company: null,
        logo: "/designer-logo/tick.png",
        slogan: "See you in our great world.",
        mission_n_vision: "Bring good thing for good life.",
        official_websites: null,
        team_profile_ids: null,
        location_ids: null,
        created_at: moment(),
        status: DESIGN_STATUSES.ACTIVE,
      },
      {
        ...DESIGN_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Nolimit Design",
        parent_company: null,
        logo: "/designer-logo/blue.jpeg",
        slogan: "No limit.",
        mission_n_vision: "Nothing is impossible.",
        official_websites: null,
        team_profile_ids: null,
        location_ids: null,
        created_at: moment(),
        status: DESIGN_STATUSES.ACTIVE,
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "designers",
        },
      });
    });
    console.log("success seed designer data");
  };
  try {
    await createAndSeed(designerCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await designerCollection.drop();
      await createAndSeed(designerCollection);
    }
  }
};

module.exports = {
  seed,
};
