import Model from "./index";

export interface IProjectTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  type: number;
  relation_id: string;
}

export const PROJECT_TYPE_NULL_ATTRIBUTES = {
  id: "",
  name: "",
  created_at: "",
  is_deleted: false,
  type: 0,
  relation_id: "",
};

export default class ProjectTypeModel extends Model<IProjectTypeAttributes> {
  constructor() {
    super("project_types");
  }
  public findByNameOrId = (
    id: string
  ): Promise<IProjectTypeAttributes | false> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .first();
    } catch (error) {
      return Promise.resolve(false);
    }
  };
}
