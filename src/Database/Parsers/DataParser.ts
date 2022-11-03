import { ArangoDocument } from "../Interfaces";
import { isArray } from "lodash";
import { getTimestamps } from "../Utils/Time";
import { v4 as uuid } from "uuid";

class DataParser {
  public static removeDocumentKey(
    data: ArangoDocument | ArangoDocument[]
  ): any {
    if (isArray(data)) {
      return data.map((item) => this.removeDocumentKey(item));
    }

    if (data.new) {
      const { _key, _id, _rev, deleted_at, deleted_by, ...newData } = data.new;
      return newData;
    }

    const { _key, _id, _rev, deleted_at, deleted_by, ...oldData } = data;
    return oldData;
  }

  public static combineInsertData(data: any): any {
    if (isArray(data)) {
      return data.map((item) => this.combineInsertData(item));
    }
    return {
      ...data,
      id: uuid(),
      created_at: getTimestamps(),
      updated_at: data.updated_at || null,
      deleted_at: null,
    };
  }
}
export default DataParser;
