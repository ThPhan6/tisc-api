import { Database } from "arangojs";
import DataParser from '../Parsers/DataParser';
import {ENVIROMENT} from '@/config';

class Connection extends Database {
  private saveOpts = {waitForSync: true, returnNew: true};
  constructor() {
    super({
      url: ENVIROMENT.DATABASE_HOSTNAME,
    });
    this.useDatabase(ENVIROMENT.DATABASE_NAME || "");
    this.useBasicAuth(ENVIROMENT.DATABASE_USERNAME, ENVIROMENT.DATABASE_PASSWORD);
  }

  public async insert(collection: string, data: any) {
    return DataParser.removeDocumentKey(
      await this.collection(collection).save(data, this.saveOpts )
    );
  }

  public removeByKeys (collection: string, keys: string[]) {
    return this.collection(collection).removeByKeys(
      keys, this.saveOpts
    );
  }
}

export default Connection;
export const connection = new Connection();
export type ConnectionInterface = typeof connection;
