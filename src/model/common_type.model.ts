import Model from "./index";
import { COMMON_TYPES } from '../constant/common.constant';

export interface CommonType {
  id: string;
  name: string;
  type: number;
  relation_id: string;
  created_at: string;
  is_deleted: boolean;
}

export const DEFAULT_COMMON_TYPE = {
  name: '',
  relation_id: '',
  is_deleted: false,
  type: COMMON_TYPES.SHARING_GROUP,
}

export default class CommonTypeModel extends Model<CommonType> {
  constructor() {
    super("common_types");
  }
  public findByNameOrId = (
    id: string,
    relation_id: string,
    type: number = 1,
  ): Promise<CommonType | false> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where('type', type)
        .whereOrRevert(["id", "name"], id)
        .whereOr("relation_id", [relation_id, ""])
        .first();
    } catch (error) {
      return Promise.resolve(false);
    }
  };
  public getAllByRelationAndType = (
    relation_id: string,
    type: number = 1,
  ): Promise<CommonType[]> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where('type', type)
        .whereOr("relation_id", [relation_id, ""])
        .select(['id', 'name']);
    } catch (error) {
      return Promise.resolve([]);
    }
  };
}
