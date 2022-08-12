import Model from "./index";

export interface IRequirementTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const REQUIREMENT_TYPE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
  design_id: null,
};

export default class RequirementTypeModel extends Model<IRequirementTypeAttributes> {
  constructor() {
    super("requirement_types");
  }
  public findByNameOrId = (
    id: string,
    relation_id: string
  ): Promise<IRequirementTypeAttributes | false> => {
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
