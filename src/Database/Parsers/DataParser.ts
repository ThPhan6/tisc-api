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
      const {
        _key: _newKey,
        _id: _newId,
        _rev: _newRev,
        deleted_at: _newDeletedAt,
        deleted_by: _deletedBy,
        ...newData
      } = data.new;
      return newData;
    }

    const { _key, _id, _rev, deleted_at, deleted_by, ...oldData } = data;
    return oldData;
  }

  public static combineInsertData(data: any): any {
    if (isArray(data)) {
      return data.map((item) => this.combineInsertData(item));
    }
    const now = getTimestamps();
    return {
      id: uuid(),
      ...data,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
  }
}
export default DataParser;
