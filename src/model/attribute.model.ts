import Model from "./index";

export interface IAttributeAttributes {
  id: string;
  type: number;
  name: string;
  subs: {
    id: string;
    name: string;
    basis_id: string;
    description: string;
  }[];
  created_at: string;
  is_deleted: boolean;
}
export const ATTRIBUTE_NULL_ATTRIBUTES = {
  id: null,
  type: null,
  name: null,
  subs: null,
  created_at: null,
  is_deleted: false,
};

export default class AttributeModel extends Model<IAttributeAttributes> {
  constructor() {
    super("attributes");
  }
  public getDuplicatedAttribute = async (id: string, name: string) => {
    try {
      const result: any = await this.builder
        .whereNot("id", id)
        .where("name", name.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
