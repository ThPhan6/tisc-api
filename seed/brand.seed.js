const uuid = require("uuid").v4;
const moment = require("moment");
const BRAND_NULL_ATTRIBUTES = require("./constant").BRAND_NULL_ATTRIBUTES;
const BRAND_STATUSES = require("./constant").BRAND_STATUSES;

const seed = async (db) => {
  const brandCollection = await db.collection("brands");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...BRAND_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Global stone",
        parent_company: null,
        logo: "/brand-logo/tick.png",
        slogan: "See you in our great world.",
        mission_n_vision: "Bring good thing for good life.",
        official_websites: null,
        team_profile_ids: null,
        location_ids: null,
        created_at: moment(),
        status: BRAND_STATUSES.ACTIVE,
      },
      {
        ...BRAND_NULL_ATTRIBUTES,
        id: uuid(),
        name: "SileStone",
        parent_company: null,
        logo: "/brand-logo/blue.jpeg",
        slogan: "SileStone is the best.",
        mission_n_vision: "Nothing is impossible.",
        official_websites: null,
        team_profile_ids: null,
        location_ids: null,
        created_at: moment(),
        status: BRAND_STATUSES.ACTIVE,
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "brands",
        },
      });
    });
    console.log("success seed brand data");
  };
  try {
    await createAndSeed(brandCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await brandCollection.drop();
      await createAndSeed(brandCollection);
    }
  }
};

module.exports = {
  seed,
};
