import { Database } from "arangojs";
import dotenv from "dotenv";
dotenv.config();

const Connection = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
Connection.useDatabase(process.env.DATABASE_NAME || "");
Connection.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

export default Connection;
