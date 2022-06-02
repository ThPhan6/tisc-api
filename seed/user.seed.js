const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();
const uuid = require("uuid").v4;

const ROLES = require("./constant").ROLES;
const SYSTEM_TYPE = require("./constant").SYSTEM_TYPE;
const USER_STATUSES = require("./constant").USER_STATUSES;
const USER_NULL_ATTRIBUTES = require("./constant").USER_NULL_ATTRIBUTES;

const TISC_ADMIN_USER_ID = "1110813b-8422-4e94-8d2a-8fdef644480e";
const TISC_ADMIN_USER_PASSWORD =
  "$2a$09$Uk42d5scAMr8MkxbzTTsceXpsouiX4aKFXL4NHQ6b.HHBI23rpIgS";
const TISC_ADMIN_USER_EMAIL = "admin@tisc.com";

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const collection = await db.collection("users");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...USER_NULL_ATTRIBUTES,
        id: TISC_ADMIN_USER_ID,
        role_id: ROLES.TISC_ADMIN,
        firstname: "Tisc",
        lastname: "admin",
        email: TISC_ADMIN_USER_EMAIL,
        password: TISC_ADMIN_USER_PASSWORD,
        is_verified: true,
        status: USER_STATUSES.ACTIVE,
        type: SYSTEM_TYPE.TISC,
        relation_id: null,
      },
      {
        ...USER_NULL_ATTRIBUTES,
        id: uuid(),
        role_id: ROLES.TISC_CONSULTANT_TEAM,
        firstname: "Tisc",
        lastname: "consultant",
        email: "nguyenquanbm98@gmail.com",
        password: TISC_ADMIN_USER_PASSWORD,
        is_verified: true,
        status: USER_STATUSES.ACTIVE,
        type: SYSTEM_TYPE.TISC,
        relation_id: null,
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "users",
        },
      });
    });
    console.log("success seed user data");
  };
  try {
    await createAndSeed(collection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await collection.drop();
      await createAndSeed(collection);
    }
  }
};

module.exports = {
  seedUser: seed,
};
