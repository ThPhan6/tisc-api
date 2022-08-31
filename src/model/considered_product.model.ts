import { removeUnnecessaryArangoFields } from "../query_builder";
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

export const CONSIDERED_PRODUCT_NULL_ATTRIBUTES = {
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

  public findConsideredProductByZone = async (project_zone_id: string) => {
    const params = {} as any;
    params.zone_id = project_zone_id;
    let rawQuery = `
    for u in considered_products
    for zone in project_zones
        filter zone.id == @zone_id
        for area in zone.areas
            for room in area.rooms
                filter u.project_zone_id == room.id
      COLLECT WITH COUNT INTO length
      RETURN merge({total: length})
    `;
    let result: any = await this.getBuilder().raw(rawQuery, params);
    if (result === false) {
      return false;
    }
    return result._result[0];
  };
}
