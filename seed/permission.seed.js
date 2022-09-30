const moment = require("moment");
const uuid = require("uuid").v4;
const ROLES = require("./constant").ROLES;
const ROUTE_IDS = require("./constant").ROUTE_IDS;
const PERMISSION_TITLE = require("./constant").PERMISSION_TITLE;
const PERMISSION_NULL_ATTRIBUTES =
  require("./constant").PERMISSION_NULL_ATTRIBUTES;
const SYSTEM_TYPE = require("./constant").SYSTEM_TYPE;
const LOGO_PATH = require("./constant").LOGO_PATH;
const permissions = require("./jsons/permission.json");

const seed = async (db) => {
  const permissionCollection = await db.collection("permissions");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const data = permissions.reduce((res, permission, currentIndex) => {
      const now = moment(); /// 2022-09-08 08:00:00;
      const permission_id = `permission_${currentIndex}`;
      const {subs, ...rest} = permission;
      res.push({
        id: permission_id,
        ...rest,
        parent_id: null,
        created_at: now,
        updated_at: now,
      })
      if (subs) {
        res = res.concat(subs.map((sub, subIndex) => {
          return {
            ...sub,
            id: `${permission_id}_${subIndex}`,
            parent_id: permission_id,
            created_at: now,
            updated_at: now,
          };
        }));
      }
      return res;
    }, []);

    data.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "permissions",
        },
      });
    });
    console.log("success seed tisc permssion data");
  };
  try {
    await createAndSeed(permissionCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await permissionCollection.drop();
      await createAndSeed(permissionCollection);
    }
  }
};

module.exports = {
  seed,
};
