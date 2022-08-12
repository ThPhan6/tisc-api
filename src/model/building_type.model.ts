import Model from "./index";

export interface IBuildingTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  type: number;
  relation_id: string;
}

export const BUILDING_TYPE_NULL_ATTRIBUTES = {
  id: "",
  name: "",
  created_at: "",
  is_deleted: false,
  type: 0,
  relation_id: "",
};

export default class BuildingTypeModel extends Model<IBuildingTypeAttributes> {
  constructor() {
    super("building_types");
  }
  public findByNameOrId = (
    id: string,
    relation_id: string,
  ): Promise<IBuildingTypeAttributes | false> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .where("relation_id", relation_id)
        .first();
    } catch (error) {
      return Promise.resolve(false);
    }
  };
}
