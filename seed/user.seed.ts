import { Database } from "arangojs";
import dotenv from "dotenv";
dotenv.config();
const roles = require("../src/constant/user.constant").ROLES;
const adminUserId = require("../src/constant/user.constant").ADMIN_USER_ID;
const adminUserEmail =
  require("../src/constant/user.constant").ADMIN_USER_EMAIL;
const statuses = require("../src/constant/user.constant").STATUSES;
const adminFullname =
  require("../src/constant/user.constant").ADMIN_USER_FULL_NAME;
const adminPassword =
  require("../src/constant/user.constant").ADMIN_USER_PASSWORD;

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const seed = async () => {
  const collection = await db.collection("user");

  try {
    await collection.create();
  } catch (error) {
    try {
      await collection.get();
      const record = {
        id: adminUserId,
        role_id: roles.ADMIN,
        fullname: adminFullname,
        password: adminPassword,
        email: adminUserEmail,
        phone_number: null,
        company_name: null,
        address: null,
        is_verified: true,
        verification_token: null,
        reset_password_token: null,
        status: statuses.ACTIVE,
        avatar: null,
      };

      const users: any = await db.query({
        query: `for data in @@model filter data.id == @id return data`,
        bindVars: {
          "@model": "user",
          id: adminUserId,
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
      console.log(error);
    }
  }
};

seed();
