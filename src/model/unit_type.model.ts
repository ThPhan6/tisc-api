import Model from "./index";

export interface IUnitTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const UNIT_TYPE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
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
  ): Promise<Partial<IUnitTypeAttributes> | undefined> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .whereOr("design_id", [relation_id, ""])
        .first();
    } catch (error) {
      return Promise.resolve(undefined);
    }
  };
  public getCustomList = (
    relation_id: string
  ): Promise<Pick<IUnitTypeAttributes, 'id' | 'name'>[]> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOr("design_id", [relation_id, ""])
        .orderBy('name', 'ASC')
        .select(['id', 'name']);
    } catch (error) {
      return Promise.resolve([]);
    }
  };
}
