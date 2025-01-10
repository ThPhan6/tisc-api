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

  public static combineInsertData(data: any, table?: string): any {
    if (isArray(data)) {
      return data.map((item) => this.combineInsertData(item));
    }
    const now = getTimestamps();
    let dataToCreate = {
      ...data,
      id: uuid(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    if (
      [
        "bases",
        "basis_option_mains",
        "additional_sub_groups",
        "attributes",
        "inventories",
        "locations",
      ].includes(table || "")
    ) {
      dataToCreate = {
        id: uuid(),
        ...data,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    }
    return dataToCreate;
  }
}
export default DataParser;
