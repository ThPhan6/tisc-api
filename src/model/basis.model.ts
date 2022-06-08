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
}
