import InventoryModel from "@/models/inventory.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryEntity } from "@/types";

class InventoryRepository extends BaseRepository<InventoryEntity> {
  protected model: InventoryModel;

  constructor() {
    super();
    this.model = new InventoryModel();
  }

  public async getByCategoryId(categoryId: string): Promise<InventoryEntity> {
    return await this.model
      .where(categoryId, "==", "inventory_category_id")
      .get();
  }
}

export const inventoryRepository = new InventoryRepository();
export default InventoryRepository;
