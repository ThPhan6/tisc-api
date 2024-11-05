import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { inventoryRepository } from "@/repositories/inventory.repository";
import partnerRepository from "@/repositories/partner.repository";
import { warehouseRepository } from "@/repositories/warehouse.repository";
import { warehouseLedgerRepository } from "@/repositories/warehouse_ledger.repository";
import {
  InventoryActionDescription,
  InventoryActionType,
  UserAttributes,
  WarehouseEntity,
  WarehouseNonPhysicalType,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { NonPhysicalWarehouseCreate, WarehouseCreate } from "./warehouse.type";
import { inventoryActionRepository } from "@/repositories/inventory_action.repository";
import { getInventoryActionDescription } from "@/helpers/common.helper";
import { brandRepository } from "@/repositories/brand.repository";

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
      !payload?.relation_id
    ) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const warehouseExisted = await warehouseRepository.findBy({
      name: payload.name,
    });

    let warehouse: WarehouseEntity | undefined;
    if (!warehouseExisted) {
      warehouse = await warehouseRepository.create({
        name: payload.name,
        location_id: payload.location_id,
        parent_id: payload.parent_id,
        relation_id: payload.relation_id,
        type: WarehouseType.NON_PHYSICAL,
        status: WarehouseStatus.ACTIVE,
      });
    }

    if (!warehouse) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    let ledgerExisted = await warehouseLedgerRepository.findBy({
      warehouse_id: warehouse.id,
      inventory_id: payload.inventory_id,
    });

    if (!ledgerExisted) {
      ledgerExisted = await warehouseLedgerRepository.create({
        warehouse_id: warehouse.id,
        inventory_id: payload.inventory_id,
        status: WarehouseStatus.ACTIVE,
        quantity: 0,
      });
    }

    if (!ledgerExisted) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const newLedgerQuantity = ledgerExisted.quantity + payload.quantity;

    if (newLedgerQuantity < 0) {
      return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
    }

    ledgerExisted = (await warehouseLedgerRepository.update(ledgerExisted.id, {
      quantity: newLedgerQuantity,
    })) as any;

    if (!ledgerExisted) {
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
        ledgerExisted.quantity > newLedgerQuantity
          ? InventoryActionType.IN
          : InventoryActionType.OUT,
    });

    return successResponse({
      data: {
        warehouse,
        ledger: ledgerExisted,
        inventory_action: inventoryAction,
      },
    });
  }

  public async get(relation_id: string) {
    const warehouses = warehouseRepository.getAllBy({ relation_id });
    return successResponse(warehouses);
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
        WarehouseNonPhysicalType.IN_STOCK,
        WarehouseNonPhysicalType.ON_ORDER,
        WarehouseNonPhysicalType.BACK_ORDER,
        WarehouseNonPhysicalType.DONE,
      ].map(
        async (type) =>
          await this.createNonPhysicalWarehouse({
            ...payload,
            created_by: user.id,
            parent_id: (physicalWarehouseExisted as WarehouseEntity).id,
            name: `${(physicalWarehouseExisted as WarehouseEntity).id}_${type}`,
          })
      )
    );

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const warehouseService = new WarehouseService();
export default WarehouseService;
