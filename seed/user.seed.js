const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();

const ROLES = {
  ADMIN: "ad9ee233-a2c5-4623-a0a8-c9fd724414cc",
  NORMAL: "f484788d-7d6e-4a4a-b94e-75e6b21ad9a9",
};

const ADMIN_USER_ID = "69a24b5e-a2fd-4075-a0da-86829ce2e889";
const ADMIN_USER_PASSWORD =
  "$2a$12$n83se1f3q6G9jNYqC0IZEeSDLxzD44D/4nj.xr.UJuTz7NjbsHG/C";
const ADMIN_USER_EMAIL = "admin@tisc.com";
const ADMIN_USER_FULL_NAME = "admin";

const STATUSES = {
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
      id: ADMIN_USER_ID,
      role_id: ROLES.ADMIN,
      fullname: ADMIN_USER_FULL_NAME,
      password: ADMIN_USER_PASSWORD,
      email: ADMIN_USER_EMAIL,
      phone_number: null,
      company_name: null,
      address: null,
      is_verified: true,
      verification_token: null,
      reset_password_token: null,
      status: STATUSES.ACTIVE,
      avatar: null,
    };

    const users = await db.query({
      query: `for data in @@model filter data.id == @id return data`,
      bindVars: {
        "@model": "user",
        id: ADMIN_USER_ID,
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
