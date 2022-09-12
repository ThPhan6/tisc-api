import { Database } from "arangojs";
import DataParser from '../Parsers/DataParser';
import dotenv from "dotenv";
dotenv.config();

class Connection extends Database {
  private saveOpts = {waitForSync: true, returnNew: true};
  constructor() {
    super({
      url: process.env.DATABASE_HOSTNAME,
    });
    this.useDatabase(process.env.DATABASE_NAME || "");
    this.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
  }

  public async insert(collection: string, data: any) {
    return DataParser.removeDocumentKey(
      await this.collection(collection).save(data, this.saveOpts )
    );
  }
}

export type ConnectionInterface = typeof Connection;
export default Connection;
