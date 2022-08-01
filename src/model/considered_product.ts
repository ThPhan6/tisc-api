import Model from "./index";

export interface IConsideredProductAttributes {
  id: string;
  project_id: string;
  product_id: string;
  project_zone_id: string | null;
  assigned_by: string;
  created_at: string;
  status: number;
  is_deleted: boolean;
  is_entire: boolean;
}

export const CONSIDERED_PRODUCT_TIP_NULL_ATTRIBUTES = {
  id: null,
  product_id: null,
  project_id: null,
  project_zone_id: null,
  assigned_by: null,
  created_at: null,
  status: 0,
  is_deleted: false,
  is_entire: false,
};
export default class ConsideredProductTipModel extends Model<IConsideredProductAttributes> {
  constructor() {
    super("considered_products");
  }
}
