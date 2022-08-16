import Model from "./index";

export interface IUnitTypeAttributes {
  id: string;
  name: string;
  code: string;
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const UNIT_TYPE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  code: null,
  created_at: null,
  is_deleted: false,
  design_id: null,
};

export default class UnitTypeModel extends Model<IUnitTypeAttributes> {
  constructor() {
    super("unit_types");
  }
  public findByNameOrId = (
    id: string,
    relation_id: string
  ): Promise<IUnitTypeAttributes | false> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .where("design_id", relation_id)
        .first();
    } catch (error) {
      return Promise.resolve(false);
    }
  };
}
