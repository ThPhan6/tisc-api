import { Database } from "arangojs";
import {ENVIROMENT} from '../../src/config';

const saveOpts = {waitForSync: true, returnNew: true};
const db = new Database({
  url: ENVIROMENT.DATABASE_HOSTNAME,
});
db.useDatabase(ENVIROMENT.DATABASE_NAME || "");
db.useBasicAuth(ENVIROMENT.DATABASE_USERNAME, ENVIROMENT.DATABASE_PASSWORD);


export const insertTempData = async (collection: string, data: any) => {
  const response = await db.collection(collection).save(data, saveOpts);
  return response.new;
}

export const removeByKeys = (collection: string, keys: string[]) => {
  return db.collection(collection).removeByKeys(
    keys, saveOpts
  );
}
