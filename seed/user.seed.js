const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();

export const ROLES = {
  TISC_ADMIN: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
  TISC_NORMAL: "248a21fc-42e0-48c6-9bc2-b95e11a81fb7",
  BRAND_ADMIN: "62ad5077-6183-435e-97f8-81c35065504e",
  BRAND_NORMAL: "c93584c7-7987-4be0-aa7d-e48e20960630",
  DESIGNER_ADMIN: "68fdf6d0-464e-404b-90e8-5d02a48ac498",
  DESIGNER_NORMAL: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
};

export const TISC_ADMIN_USER_ID = "1110813b-8422-4e94-8d2a-8fdef644480e";
export const TISC_ADMIN_USER_PASSWORD =
  "$2a$09$Uk42d5scAMr8MkxbzTTsceXpsouiX4aKFXL4NHQ6b.HHBI23rpIgS";
export const TISC_ADMIN_USER_EMAIL = "admin@tisc.com";
export const TISC_ADMIN_USER_FULL_NAME = "admin";

export const USER_STATUSES = {
  ACTIVE: 1,
  BLOCKED: 0,
};

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const collection = await db.collection("user");

  try {
    await collection.create();
    await collection.get();
    const record = {
      id: TISC_ADMIN_USER_ID,
      role_id: ROLES.TISC_ADMIN,
      fullname: TISC_ADMIN_USER_FULL_NAME,
      password: TISC_ADMIN_USER_PASSWORD,
      email: TISC_ADMIN_USER_EMAIL,
      phone: null,
      mobile: null,
      backup_email: null,
      personal_mobile: null,
      is_verified: true,
      verification_token: null,
      reset_password_token: null,
      status: USER_STATUSES.ACTIVE,
      avatar: null,
      model: "tisc",
      relation_id: null,
    };

    const users = await db.query({
      query: `for data in @@model filter data.id == @id return data`,
      bindVars: {
        "@model": "user",
        id: TISC_ADMIN_USER_ID,
      },
    });
    const admin = users._result[0];
    if (!admin) {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "user",
        },
      });
    }
    console.log("success");
  } catch (error) {
    console.log(error.message);
  }
};

seed();
