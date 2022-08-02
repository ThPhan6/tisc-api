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
  public findByNameOrId = async (id: string): Promise<any> => {
    try {
      const result = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
