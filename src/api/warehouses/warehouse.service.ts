import { MESSAGES } from "@/constants";
import { getInventoryActionDescription } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import { inventoryActionRepository } from "@/repositories/inventory_action.repository";
import { inventoryLedgerRepository } from "@/repositories/inventory_ledger.repository";
import { locationRepository } from "@/repositories/location.repository";
import { warehouseRepository } from "@/repositories/warehouse.repository";
import {
  InventoryActionDescription,
  InventoryActionEntity,
  InventoryActionType,
  InventoryLedgerEntity,
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { difference, head, pick } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import {
  NonPhysicalWarehouseCreate,
  WarehouseCreate,
  WarehouseListResponse,
  WarehouseResponse,
} from "./warehouse.type";

class WarehouseService {
  private nonPhysicalWarehouseTypes = [
    WarehouseType.IN_STOCK,
    WarehouseType.ON_ORDER,
    WarehouseType.BACK_ORDER,
    WarehouseType.DONE,
  ];

  private getInventoryActionType(oldQuantity: number, newQuantity: number) {
    return newQuantity > oldQuantity
      ? InventoryActionType.IN
      : InventoryActionType.OUT;
  }

  private async validateUpdateNonPhysicalWarehouse(
    data: {
      warehouse: boolean | WarehouseEntity | undefined;
      ledger: InventoryLedgerEntity | undefined | null;
      inventoryAction: InventoryActionEntity | undefined | null;
    }[]
  ) {
    const warehouses = data
      .map((el) => el.warehouse)
      .filter(Boolean) as unknown as WarehouseEntity[];
    const warehouseIds = warehouses.map((el) => el.id);

    let errorMessage = "";
    const differenceTypes = difference(
      warehouses.map((el) => el.type),
      this.nonPhysicalWarehouseTypes
    );

    if (differenceTypes.length) {
      errorMessage = `Cannot update ${warehouses
        .map((el) => el.name)
        .join(", ")} warehouse. `;
    }

    const ledgerWarehouseIds = data
      .map((el) => el?.ledger)
      .map((el) => el?.warehouse_id)
      .filter(Boolean);
    const differenceLedgers = difference(warehouseIds, ledgerWarehouseIds);

    if (differenceLedgers.length) {
      errorMessage =
        errorMessage +
        `Cannot update ${warehouses
          .filter((el) => ledgerWarehouseIds.includes(el.id))
          .map((el) => el.name)
          .join(", ")} ledger. `;
    }

    const inventoryActionWarehouseIds = data
      .map((el) => el?.inventoryAction)
      .map((el) => el?.warehouse_id)
      .filter(Boolean) as unknown as string[];
    const differenceInventoryActions = difference(
      warehouseIds,
      inventoryActionWarehouseIds
    );

    if (differenceInventoryActions.length) {
      errorMessage =
        errorMessage +
        `Cannot update ${warehouses
          .filter((el) => inventoryActionWarehouseIds.includes(el.id))
          .map((el) => el.name)
          .join(", ")} inventory action`;
    }

    if (errorMessage) {
      return errorMessageResponse(errorMessage);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  private async createNonPhysicalWarehouse(
    payload: Omit<NonPhysicalWarehouseCreate, "inventory_action_type">
  ): Promise<{
    data?: any;
    message: string;
    statusCode: number;
  }> {
    if (
      !payload?.created_by ||
      !payload?.name ||
      !payload?.parent_id ||
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
      if (payload.quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      existedLedger = await inventoryLedgerRepository.create({
        warehouse_id: warehouse.id,
        inventory_id: payload.inventory_id,
        status: WarehouseStatus.ACTIVE,
        quantity: payload.quantity ?? 0,
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
      quantity: newLedgerQuantity ?? 0,
    })) as any;

    if (!existedLedger) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const inventoryAction = await inventoryActionRepository.create({
      warehouse_id: warehouse.id,
      inventory_id: payload.inventory_id,
      quantity: payload.quantity ?? 0,
      created_by: payload.created_by,
      type: this.getInventoryActionType(
        existedLedger.quantity,
        newLedgerQuantity
      ),
      description: getInventoryActionDescription(
        InventoryActionDescription.ADJUST
      ),
    });

    return successResponse({
      data: {
        warehouse,
        ledger: existedLedger,
        inventory_action: inventoryAction,
      },
      message: MESSAGES.SUCCESS,
    }) as any;
  }

  private async updateNonPhysicalWarehouse(
    payload: Pick<
      NonPhysicalWarehouseCreate,
      "created_by" | "parent_id" | "quantity" | "inventory_id"
    >
  ) {
    const {
      created_by: userId,
      parent_id: parentId,
      inventory_id: inventoryId,
      quantity = 0,
    } = payload;

    if (!userId) {
      return {
        ...errorMessageResponse(MESSAGES.USER_NOT_FOUND),
        data: null,
      };
    }

    if (!inventoryId) {
      return {
        ...errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND),
        data: null,
      };
    }

    if (!parentId) {
      return {
        ...errorMessageResponse(MESSAGES.USER_NOT_FOUND),
        data: null,
      };
    }

    const physicalWarehouse = await warehouseRepository.findBy({
      id: parentId,
      type: WarehouseType.PHYSICAL,
    });

    if (!physicalWarehouse) {
      return {
        ...errorMessageResponse(MESSAGES.NOT_FOUND),
        data: null,
      };
    }

    const allNonPhysicalWarehouses =
      await warehouseRepository.getAllNonPhysicalWarehousesByParentId(parentId);

    if (!allNonPhysicalWarehouses) {
      return {
        ...errorMessageResponse(MESSAGES.NOT_FOUND),
        data: null,
      };
    }

    if (physicalWarehouse.status !== WarehouseStatus.ACTIVE) {
      const physicalWarehouseUpdated = await warehouseRepository.update(
        physicalWarehouse.id,
        {
          status: WarehouseStatus.ACTIVE,
        }
      );

      if (!physicalWarehouseUpdated) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
      }

      const allNonPhysicalWarehouseUpdated = await Promise.all(
        allNonPhysicalWarehouses.map(
          async (ws) =>
            await warehouseRepository.findAndUpdate(ws.id, {
              status: WarehouseStatus.ACTIVE,
            })
        )
      );

      if (!allNonPhysicalWarehouseUpdated.length) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
      }
    }

    const inStockWarehouse = allNonPhysicalWarehouses.find(
      (el) => el.type === WarehouseType.IN_STOCK
    );

    if (!inStockWarehouse) {
      return {
        ...errorMessageResponse(MESSAGES.NOT_FOUND),
        data: null,
      };
    }

    let existedLedger = await inventoryLedgerRepository.findBy({
      warehouse_id: inStockWarehouse.id,
    });

    if (!existedLedger) {
      if (quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      existedLedger = await inventoryLedgerRepository.create({
        warehouse_id: inStockWarehouse.id,
        inventory_id: inventoryId,
        status: WarehouseStatus.ACTIVE,
        quantity: quantity ?? 0,
      });
    }

    if (!existedLedger) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE),
        data: null,
      };
    }

    const newLedgerQuantity = existedLedger.quantity + quantity;

    if (newLedgerQuantity < 0) {
      return {
        ...errorMessageResponse(MESSAGES.LESS_THAN_ZERO),
        data: null,
      };
    }

    const newLedger = await inventoryLedgerRepository.update(existedLedger.id, {
      quantity: newLedgerQuantity,
      status: WarehouseStatus.ACTIVE,
    });

    if (!newLedger) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE),
        data: null,
      };
    }

    const inventoryAction = await inventoryActionRepository.create({
      warehouse_id: inStockWarehouse.id,
      inventory_id: newLedger.inventory_id,
      quantity: newLedger.quantity === 0 ? 0 : quantity,
      created_by: userId,
      type: this.getInventoryActionType(
        existedLedger.quantity,
        newLedgerQuantity
      ),
      description: getInventoryActionDescription(
        InventoryActionDescription.ADJUST
      ),
    });

    if (!inventoryAction) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE),
        data: null,
      };
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  private async deleteNonPhysicalWarehouse(
    payload: Pick<NonPhysicalWarehouseCreate, "created_by" | "parent_id">
  ) {
    const { created_by: userId, parent_id: parentId } = payload;

    if (!userId) {
      return {
        ...errorMessageResponse(MESSAGES.USER_NOT_FOUND),
        data: null,
      };
    }

    if (!parentId) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE),
        data: null,
      };
    }

    const allNonPhysicalWarehouses =
      await warehouseRepository.getAllNonPhysicalWarehousesByParentId(parentId);

    if (!allNonPhysicalWarehouses) {
      return {
        ...errorMessageResponse(MESSAGES.NOT_FOUND),
        data: null,
      };
    }

    let inventoryAction: InventoryActionEntity | null = null;
    let ledger: InventoryLedgerEntity | null = null;

    const data = await Promise.all(
      allNonPhysicalWarehouses.map(async (el) => {
        const warehouse = await warehouseRepository.update(el.id, {
          status: WarehouseStatus.INACTIVE,
        });

        if (!warehouse) {
          return {
            warehouse: null,
            ledger: null,
            inventoryAction: null,
          };
        }

        if (el.type == WarehouseType.IN_STOCK) {
          const prevLedger = await inventoryLedgerRepository.findBy({
            warehouse_id: el.id,
          });

          if (!prevLedger) {
            return {
              warehouse,
              ledger: null,
              inventoryAction: null,
            };
          }

          ledger = (await inventoryLedgerRepository.update(prevLedger.id, {
            status: WarehouseStatus.INACTIVE,
            quantity: el.type === WarehouseType.IN_STOCK ? 0 : undefined,
          })) as InventoryLedgerEntity;

          if (!ledger) {
            return {
              warehouse,
              ledger: null,
              inventoryAction: null,
            };
          }

          inventoryAction = (await inventoryActionRepository.create({
            warehouse_id: el.id,
            inventory_id: ledger.inventory_id,
            quantity:
              Number(prevLedger.quantity) === 0 ? 0 : -prevLedger.quantity,
            created_by: userId,
            type: InventoryActionType.OUT,
            description: getInventoryActionDescription(
              InventoryActionDescription.ADJUST
            ),
          })) as InventoryActionEntity;
        }

        return {
          warehouse,
          ledger,
          inventoryAction,
        };
      })
    );

    return this.validateUpdateNonPhysicalWarehouse(
      data
        .map((el) => {
          if (el.warehouse?.type === WarehouseType.IN_STOCK) {
            return el;
          }
        })
        .filter(Boolean) as any
    );
  }

  public async getList(
    inventoryId: string,
    status?: WarehouseStatus,
    type: WarehouseType = WarehouseType.IN_STOCK
  ) {
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

    const warehouses: WarehouseResponse[] = [];
    await Promise.all(
      inventoryLedgers.map(async (inventoryLedger) => {
        const conditionObj: Partial<WarehouseEntity> = {
          id: inventoryLedger.warehouse_id,
          type,
        };

        if (status) {
          conditionObj.status = status;
        }

        const nonePhysicalWarehouse = await warehouseRepository.findBy(
          conditionObj
        );

        if (!nonePhysicalWarehouse?.parent_id) {
          return;
        }

        const location = await locationRepository.find(
          nonePhysicalWarehouse.location_id
        );

        warehouses.push({
          ...pick(nonePhysicalWarehouse, "id", "created_at", "name"),
          location_id: location?.id ?? "",
          country_name: location?.country_name ?? "",
          city_name: location?.city_name ?? "",
          in_stock: Number(inventoryLedger.quantity),
        });
      })
    );

    return successResponse({
      data: {
        warehouses: warehouses,
        total_stock: warehouses.reduce((acc, item) => acc + item.in_stock, 0),
      } as WarehouseListResponse,
    });
  }

  public async create(user: UserAttributes, payload: WarehouseCreate) {
    const inventoryExisted = await inventoryRepository.find(
      payload.inventory_id
    );

    if (!inventoryExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    const categoryExisted = await dynamicCategoryRepository.find(
      inventoryExisted.inventory_category_id
    );

    if (!categoryExisted) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const brandId = await brandRepository.find(categoryExisted.relation_id);

    if (!brandId) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const locationExisted = await locationRepository.find(payload.location_id);

    if (!locationExisted) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    let physicalWarehouseExisted: WarehouseEntity | undefined;

    physicalWarehouseExisted = await warehouseRepository.findBy({
      location_id: locationExisted.id,
      type: WarehouseType.PHYSICAL,
    });

    if (!physicalWarehouseExisted) {
      if (payload.quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      physicalWarehouseExisted = await warehouseRepository.create({
        name: locationExisted.business_name,
        location_id: locationExisted.id,
        parent_id: null,
        relation_id: brandId.id,
        type: WarehouseType.PHYSICAL,
        status: WarehouseStatus.ACTIVE,
      });

      if (!physicalWarehouseExisted) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
      }

      const nonPhysicalWarehouses = await Promise.all(
        this.nonPhysicalWarehouseTypes.map(
          async (type) =>
            await this.createNonPhysicalWarehouse({
              ...payload,
              quantity: type === WarehouseType.IN_STOCK ? payload.quantity : 0,
              type,
              created_by: user.id,
              relation_id: brandId.id,
              parent_id: (physicalWarehouseExisted as WarehouseEntity).id,
              name: (physicalWarehouseExisted as WarehouseEntity).name,
            })
        )
      );

      const res = head(nonPhysicalWarehouses) as any;

      return {
        message: res?.message,
        statusCode: res?.statusCode,
      };
    }

    const nonPhysicalWarehouses = await this.updateNonPhysicalWarehouse({
      created_by: user.id,
      parent_id: physicalWarehouseExisted.id,
      quantity: payload.quantity,
      inventory_id: payload.inventory_id,
    });

    return {
      message: nonPhysicalWarehouses.message,
      statusCode: nonPhysicalWarehouses.statusCode,
    };
  }

  public async delete(user: UserAttributes, locationId: string) {
    const locationExisted = await locationRepository.find(locationId);

    if (!locationExisted) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    const instockWarehouseExisted = await warehouseRepository.findBy({
      location_id: locationId,
      type: WarehouseType.IN_STOCK,
    });

    if (!instockWarehouseExisted) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    if (instockWarehouseExisted.status !== WarehouseStatus.ACTIVE) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.NOT_AVAILABLE);
    }

    if (!instockWarehouseExisted?.parent_id) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const physicalWarehouseExisted = await warehouseRepository.update(
      instockWarehouseExisted.parent_id,
      {
        status: WarehouseStatus.INACTIVE,
      }
    );

    if (!physicalWarehouseExisted) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    const nonPhysicalWarehouses = await this.deleteNonPhysicalWarehouse({
      created_by: user.id,
      parent_id: physicalWarehouseExisted.id,
    });

    return {
      message: nonPhysicalWarehouses.message,
      statusCode: nonPhysicalWarehouses.statusCode,
    };
  }
}

export const warehouseService = new WarehouseService();
export default WarehouseService;
