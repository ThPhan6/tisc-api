import { Database } from "arangojs";
import dotenv from "dotenv";
import {DynamicValueBinding} from "../Interfaces";

dotenv.config();


class Connection extends Database {
  constructor() {
    super({
      url: process.env.DATABASE_HOSTNAME,
    });
    this.useDatabase(process.env.DATABASE_NAME || "");
    this.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

  }

  public insert = async (
    collection: string,
    data: DynamicValueBinding | DynamicValueBinding[]) => {
    return await this.collection(collection).save(
      data,
      {waitForSync: true, returnNew: true}
    );
  }
  // 
  // public update = (data: DynamicValueBinding) => {
  //   this.collection('users').byExample({id}).update()
  // }

}

export type ConnectionInterface = typeof Connection;
export default Connection;
