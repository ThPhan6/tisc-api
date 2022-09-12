import {ArangoDocument} from '../Interfaces';
import {isArray} from 'lodash';
import {getTimestamps} from '../Utils/Time';
import {v4 as uuid} from 'uuid';

class DataParser {
  public static removeDocumentKey(data: ArangoDocument | ArangoDocument[]): any {
    if (isArray(data)) {
      return data.map((item) => this.removeDocumentKey(item));
    }
    const { _key, _id, _rev, ...oldData } = data;
    if (oldData.new) {
      const { _key, _id, _rev, ...newData } = oldData.new;
      return newData;
    }
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
      created_by: null,
      updated_at: null,
      updated_by: null,
      delete_at: null,
      delete_by: null,
    }
  }
}
export default DataParser;
