const moment = require("moment");
const uuid = require("uuid").v4;
const DOCUMENTATION_NULL_ATTRIBUTES =
  require("./constant").DOCUMENTATION_NULL_ATTRIBUTES;
const DOCUMENTATION_TYPES = require("./constant").DOCUMENTATION_TYPES;
const LOGO_PATH = require("./constant").LOGO_PATH;

const seed = async (db) => {
  const documentationCollection = await db.collection("documentations");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "Onboarding Guide",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.MY_WORKSPACE,
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "My Workspace",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.USER_GROUP,
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "User Group",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PROJECT,
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "Projects",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PRODUCT,
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "Products",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.ADMINISTRATION,
        type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        title: "Administration",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "Onboarding Guide",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.MY_WORKSPACE,
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "My Workspace",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PRODUCT,
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "Products",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.GENERAL_INQUIRY,
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "General Inquries",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PROJECT_TRACKING,
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "Project Tracking",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.ADMINISTRATION,
        type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        title: "Administration",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "Onboarding Guide",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.MY_WORKSPACE,
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "My Workspace",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.FAVORITE,
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "My Favourites",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PRODUCT,
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "Products",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.PROJECT,
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "Projects",
        created_at: moment(),
      },
      {
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        id: uuid(),
        logo: LOGO_PATH.ADMINISTRATION,
        type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        title: "Administration",
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "documentations",
        },
      });
    });
    console.log("success seed documentation data");
  };
  try {
    await createAndSeed(documentationCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await documentationCollection.drop();
      await createAndSeed(documentationCollection);
    }
  }
};

module.exports = {
  seed,
};
