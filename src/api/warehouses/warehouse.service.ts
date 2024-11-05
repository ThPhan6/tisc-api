import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { inventoryRepository } from "@/repositories/inventory.repository";
import partnerRepository from "@/repositories/partner.repository";
import { warehouseRepository } from "@/repositories/warehouse.repository";
import {
  InventoryActionDescription,
  InventoryActionType,
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { NonPhysicalWarehouseCreate, WarehouseCreate } from "./warehouse.type";
import { inventoryActionRepository } from "@/repositories/inventory_action.repository";
import { getInventoryActionDescription } from "@/helpers/common.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { inventoryLedgerRepository } from "@/repositories/inventory_ledger.repository";

class WarehouseService {
  private async createNonPhysicalWarehouse(
    payload: NonPhysicalWarehouseCreate
  ) {
    if (
      !payload?.created_by ||
      !payload?.inventory_id ||
      !payload?.location_id ||
      !payload?.name ||
      !payload?.parent_id ||
      !payload?.relation_id ||
      !payload?.type
    ) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const existedWarehouse = await warehouseRepository.findBy({
      name: payload.name,
      type: payload.type,
      parent_id: payload.parent_id,
      relation_id: payload.relation_id,
    });

    let warehouse: WarehouseEntity | undefined;
    if (!existedWarehouse) {
      warehouse = await warehouseRepository.create({
        name: payload.name,
        location_id: payload.location_id,
        parent_id: payload.parent_id,
        relation_id: payload.relation_id,
        type: payload.type,
        status: WarehouseStatus.ACTIVE,
      });
    }

    if (!warehouse) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    let existedLedger = await inventoryLedgerRepository.findBy({
      warehouse_id: warehouse.id,
      inventory_id: payload.inventory_id,
    });

    if (!existedLedger) {
      existedLedger = await inventoryLedgerRepository.create({
        warehouse_id: warehouse.id,
        inventory_id: payload.inventory_id,
        status: WarehouseStatus.ACTIVE,
        quantity: 0,
      });
    }

    if (!existedLedger) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const newLedgerQuantity = existedLedger.quantity + payload.quantity;

    if (newLedgerQuantity < 0) {
      return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
    }

    existedLedger = (await inventoryLedgerRepository.update(existedLedger.id, {
      quantity: newLedgerQuantity,
    })) as any;

    if (!existedLedger) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const inventoryAction = await inventoryActionRepository.create({
      warehouse_id: warehouse.id,
      inventory_id: payload.inventory_id,
      quantity: payload.quantity,
      created_by: payload.created_by,
      description: getInventoryActionDescription(
        InventoryActionDescription.ADJUST
      ),
      type:
        existedLedger.quantity > newLedgerQuantity
          ? InventoryActionType.IN
          : InventoryActionType.OUT,
    });

    return successResponse({
      data: {
        warehouse,
        ledger: existedLedger,
        inventory_action: inventoryAction,
      },
    });
  }

  public async getList(inventoryId: string) {
    const existedInventory = await inventoryRepository.find(inventoryId);

    if (!existedInventory) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    const category = await dynamicCategoryRepository.findBy({
      id: existedInventory.inventory_category_id,
    });

    if (!category) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const brand = brandRepository.find(category.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const inventoryLedgers = await inventoryLedgerRepository.getAllBy({
      inventory_id: existedInventory.id,
    });

    const instockWarehouses: WarehouseEntity[] = [];
    await Promise.all(
      inventoryLedgers.map(async (el) => {
        const nonePhysicalWarehouse = await warehouseRepository.findBy({
          id: el.warehouse_id,
          type: WarehouseType.IN_STOCK,
        });

        if (!nonePhysicalWarehouse?.parent_id) {
          return;
        }

        const physicalWarehouse = await warehouseRepository.find(
          nonePhysicalWarehouse.parent_id
        );

        if (!physicalWarehouse) {
          return;
        }

        instockWarehouses.push(nonePhysicalWarehouse);
      })
    );

    return successResponse({
      data: instockWarehouses,
    });
  }

  public async create(user: UserAttributes, payload: WarehouseCreate) {
    const brandExisted = await brandRepository.find(payload.relation_id);

    if (!brandExisted) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const inventoryExisted = await inventoryRepository.find(
      payload.inventory_id
    );

    if (!inventoryExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    const locationExisted = await partnerRepository.find(payload.location_id);

    if (!locationExisted) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    let physicalWarehouseExisted: WarehouseEntity | undefined;

    if (payload?.id) {
      physicalWarehouseExisted = await warehouseRepository.find(payload.id);
    }

    if (!physicalWarehouseExisted) {
      physicalWarehouseExisted = await warehouseRepository.create({
        name: locationExisted.name,
        location_id: payload.location_id,
        parent_id: null,
        relation_id: payload.relation_id,
        type: WarehouseType.PHYSICAL,
        status: WarehouseStatus.ACTIVE,
      });
    }

    if (!physicalWarehouseExisted) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    await Promise.all(
      [
        WarehouseType.IN_STOCK,
        WarehouseType.ON_ORDER,
        WarehouseType.BACK_ORDER,
        WarehouseType.DONE,
      ].map(
        async (type) =>
          await this.createNonPhysicalWarehouse({
            ...payload,
            type,
            created_by: user.id,
            parent_id: (physicalWarehouseExisted as WarehouseEntity).id,
            name: locationExisted.name,
          })
      )
    );

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const warehouseService = new WarehouseService();
export default WarehouseService;
