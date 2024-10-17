import {
  InventoryCategoryListWithPaginate,
  InventoryCategoryQuery,
} from "@/api/inventory/inventory.type";
import { pagination } from "@/helpers/common.helper";
import InventoryModel from "@/models/inventory.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryEntity } from "@/types";
import { isNil, omitBy } from "lodash";

class InventoryRepository extends BaseRepository<InventoryEntity> {
  protected model: InventoryModel;

  constructor() {
    super();
    this.model = new InventoryModel();
  }

  public async getList(
    query: InventoryCategoryQuery
  ): Promise<InventoryCategoryListWithPaginate> {
    const { limit, offset = 0, category_id, sort, search, order } = query;

    const rawQuery = `
      FOR inventory IN inventories
      FILTER inventory.deleted_at == null
      ${
        category_id
          ? "FILTER inventory.inventory_category_id == @category_id"
          : ""
      }
      ${search ? `FILTER inventory.sku LIKE "%${search}%"` : ""}
      ${sort && order ? `SORT inventory.@sort @order` : ""}
      ${limit && offset ? `LIMIT ${offset}, ${limit}` : ""}
      RETURN UNSET(inventory, ["_id", "_key", "_rev", "deleted_at"])
      `;

    const result = await this.model.rawQueryV2(
      rawQuery,
      omitBy({ category_id, sort, order }, isNil)
    );

    return {
      data: result,
      pagination: pagination(limit ?? 10, offset, result.length),
    };
  }
}

export const inventoryRepository = new InventoryRepository();
export default InventoryRepository;
