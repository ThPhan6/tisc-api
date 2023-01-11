import { Database } from "arangojs";
import DataParser from "../Parsers/DataParser";
import { ENVIRONMENT } from "@/config";

class Connection extends Database {
  private saveOpts = { waitForSync: true, returnNew: true };
  constructor() {
    super({
      url: ENVIRONMENT.DATABASE_HOSTNAME,
    });
    this.useDatabase(ENVIRONMENT.DATABASE_NAME || "");
    this.useBasicAuth(
      ENVIRONMENT.DATABASE_USERNAME,
      ENVIRONMENT.DATABASE_PASSWORD
    );
  }

  public async insert(collection: string, data: any) {
    return DataParser.removeDocumentKey(
      await this.collection(collection).save(data, this.saveOpts)
    );
  }

  public removeByKeys(collection: string, keys: string[]) {
    return this.collection(collection).removeByKeys(keys, this.saveOpts);
  }

  public truncateCollection(collection: string) {
    return this.collection(collection).truncate();
  }
}

export default Connection;
export const connection = new Connection();
export type ConnectionInterface = typeof connection;
