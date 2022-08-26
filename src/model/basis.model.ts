import Model from "./index";

export interface IBasisAttributes {
  id: string;
  type: number;
  name: string;
  subs: any;
  created_at: string;
  is_deleted: boolean;
}
export const BASIS_NULL_ATTRIBUTES = {
  id: null,
  type: null,
  name: null,
  subs: null,
  created_at: null,
  is_deleted: false,
};

export default class BasisModel extends Model<IBasisAttributes> {
  constructor() {
    super("bases");
  }
  public getExistedBasis = async (id: string, name: string, type: number) => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("id", id)
        .whereNot("is_deleted", true)
        .where("type", type)
        .where("name", name.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getAllBasisByType = async (type: number) => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("type", type)
        .orderBy("created_at", "ASC")
        .select();
      return result;
    } catch (error) {
      return false;
    }
  };
}
