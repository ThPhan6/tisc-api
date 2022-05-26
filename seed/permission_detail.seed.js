const { Database } = require("arangojs");
const dotenv = require("dotenv");
const moment = require("moment");
const uuid = require("uuid").v4;
const ROLES = require("./constant").ROLES;
const ROUTES = require("./constant").ROUTES;
const SYSTEM_TYPE = require("./constant").SYSTEM_TYPE;
dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const collection = await db.collection("permission_details");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    let records = [];

    const tiscAdminPermissions = await db.query({
      query: `FOR data IN @@model FILTER data.role_id == @role_id FILTER data.type == @type return data`,
      bindVars: {
        "@model": "permissions",
        type: SYSTEM_TYPE.TISC,
        role_id: ROLES.TISC_ADMIN,
      },
    });
    const tiscConsultantTeamPermissions = await db.query({
      query: `FOR data IN @@model FILTER data.role_id == @role_id FILTER data.type == @type return data`,
      bindVars: {
        "@model": "permissions",
        type: SYSTEM_TYPE.TISC,
        role_id: ROLES.TISC_CONSULTANT_TEAM,
      },
    });

    tiscAdminPermissions._result.forEach((permission) => {
      switch (permission.name.toLowerCase()) {
        case "my workspace":
          break;
        case "brands":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.UPDATE_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.SEND_EMAIL_INVITE_BRAND,
              created_at: moment(),
            }
          );
          break;
        case "design firms":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_DESIGN_FIRM,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_DESIGN_FIRM,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.UPDATE_DESIGN_FIRM,
              created_at: moment(),
            }
          );
          break;
        case "listing":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_PROJECT,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_PROJECT,
              created_at: moment(),
            }
          );
          break;
        case "categories":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_CATEGORY,
              created_at: moment(),
            }
          );
          break;
        case "basis":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_BASIS,
              created_at: moment(),
            }
          );
          break;
        case "attributes":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_ATTRIBUTE,
              created_at: moment(),
            }
          );
          break;
        case "configurations":
          records.push({
            id: uuid(),
            permission_id: permission.id,
            route: ROUTES.CREATE_PRODUCT,
            created_at: moment(),
          });
          break;
        case "documentations":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_DOCUMENTATION,
              created_at: moment(),
            }
          );
          break;
        case "locations":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_LOCATION,
              created_at: moment(),
            }
          );
          break;
        case "team profiles":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.SEND_INVITE_TEAM_PROFILE,
              created_at: moment(),
            }
          );
          break;
        case "messages":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_QUOTATION,
              created_at: moment(),
            }
          );
          break;
        case "revenues":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_SUBSCRIPTION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_SUBSCRIPTION,
              created_at: moment(),
            }
          );
          break;
        default:
          break;
      }
    });
    tiscConsultantTeamPermissions._result.forEach((permission) => {
      switch (permission.name.toLowerCase()) {
        case "my workspace":
          break;
        case "brands":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.UPDATE_BRAND,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.SEND_EMAIL_INVITE_BRAND,
              created_at: moment(),
            }
          );
          break;
        case "design firms":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_DESIGN_FIRM,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_DESIGN_FIRM,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.UPDATE_DESIGN_FIRM,
              created_at: moment(),
            }
          );
          break;
        case "listing":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_PROJECT,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_PROJECT,
              created_at: moment(),
            }
          );
          break;
        case "categories":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_CATEGORY,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_CATEGORY,
              created_at: moment(),
            }
          );
          break;
        case "basis":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_BASIS,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_BASIS,
              created_at: moment(),
            }
          );
          break;
        case "attributes":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_ATTRIBUTE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_ATTRIBUTE,
              created_at: moment(),
            }
          );
          break;
        case "configurations":
          records.push({
            id: uuid(),
            permission_id: permission.id,
            route: ROUTES.CREATE_PRODUCT,
            created_at: moment(),
          });
          break;
        case "documentations":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_DOCUMENTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_DOCUMENTATION,
              created_at: moment(),
            }
          );
          break;
        case "locations":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_LOCATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_LOCATION,
              created_at: moment(),
            }
          );
          break;
        case "team profiles":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_TEAM_PROFILE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.SEND_INVITE_TEAM_PROFILE,
              created_at: moment(),
            }
          );
          break;
        case "messages":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_EMAIL_AUTO,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.EDIT_QUOTATION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.DELETE_QUOTATION,
              created_at: moment(),
            }
          );
          break;
        case "revenues":
          records.push(
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.CREATE_SERVICE,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_LIST_SUBSCRIPTION,
              created_at: moment(),
            },
            {
              id: uuid(),
              permission_id: permission.id,
              route: ROUTES.GET_ONE_SUBSCRIPTION,
              created_at: moment(),
            }
          );
          break;
        default:
          break;
      }
    });
    
    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "permission_details",
        },
      });
    });
    console.log("success seed tisc permssion detail data");
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
  seedPermissionDetail: seed,
};
