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
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { difference, map, pick, sumBy } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import {
  InStockWarehouseResponse,
  NonPhysicalWarehouseCreate,
  WarehouseCreate,
  WarehouseListResponse,
  WarehouseUpdate,
  WarehouseUpdateBackOrder,
} from "./warehouse.type";

class WarehouseService {
  private nonPhysicalWarehouseTypes = [
    WarehouseType.IN_STOCK,
    WarehouseType.ON_ORDER,
    WarehouseType.BACK_ORDER,
    WarehouseType.DONE,
  ];

  private async createNonPhysicalWarehouse(
    payload: NonPhysicalWarehouseCreate
  ) {
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
      quantity: payload.quantity ?? 0,
      created_by: payload.created_by,
      description: getInventoryActionDescription(
        InventoryActionDescription.ADJUST
      ),
      type:
        newLedgerQuantity > existedLedger.quantity
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

  private async updateNonPhysicalWarehouse(
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
        ...errorMessageResponse(MESSAGES.USER_NOT_FOUND),
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

    const data = await Promise.all(
      allNonPhysicalWarehouses.map(async (el) => {
        const warehouse = await warehouseRepository.update(el.id, {
          status: WarehouseStatus.INACTIVE,
        });

        const ledger =
          await inventoryLedgerRepository.updateInventoryLedgerByWarehouseId(
            el.id
          );

        const inventoryAction = await inventoryActionRepository.create({
          warehouse_id: el.id,
          inventory_id: ledger.inventory_id,
          quantity: ledger.quantity === 0 ? 0 : -ledger.quantity,
          created_by: userId,
          description: getInventoryActionDescription(
            InventoryActionDescription.ADJUST
          ),
          type: InventoryActionType.OUT,
        });

        return {
          warehouse,
          ledger,
          inventoryAction,
        };
      })
    );

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

    const ledgers = data.map((el) => el.ledger);
    const differenceLedgers = difference(
      warehouseIds,
      ledgers.map((el) => el.warehouse_id).filter(Boolean)
    );

    if (differenceLedgers.length) {
      errorMessage =
        errorMessage +
        `Cannot update ${warehouses
          .filter((el) => ledgers.map((le) => le.warehouse_id).includes(el.id))
          .map((el) => el.name)
          .join(", ")} ledger. `;
    }

    const inventoryActions = data
      .map((el) => el.inventoryAction)
      .filter(Boolean) as unknown as InventoryActionEntity[];
    const differenceInventoryActions = difference(
      warehouseIds,
      inventoryActions.map((el) => el.warehouse_id)
    );

    if (differenceInventoryActions.length) {
      errorMessage =
        errorMessage +
        `Cannot update ${warehouses
          .filter((el) =>
            inventoryActions.map((le) => le.warehouse_id).includes(el.id)
          )
          .map((el) => el.name)
          .join(", ")} inventory action`;
    }

    if (errorMessage) {
      return {
        ...errorMessageResponse(errorMessage),
        data: null,
      };
    }

    return {
      ...successMessageResponse(MESSAGES.SUCCESS),
      data,
    };
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

    const instockWarehouses: InStockWarehouseResponse[] = [];
    await Promise.all(
      inventoryLedgers.map(async (inventoryLedger) => {
        const nonePhysicalWarehouse = await warehouseRepository.findBy({
          id: inventoryLedger.warehouse_id,
          type: WarehouseType.IN_STOCK,
          status: WarehouseStatus.ACTIVE,
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

        const location = await locationRepository.find(
          physicalWarehouse.location_id
        );

        instockWarehouses.push({
          ...pick(nonePhysicalWarehouse, "id", "created_at", "name"),
          country_name: location?.country_name ?? "",
          city_name: location?.city_name ?? "",
          in_stock: Number(inventoryLedger.quantity),
        });
      })
    );

    return successResponse({
      data: {
        warehouses: instockWarehouses,
        total_stock: instockWarehouses.reduce(
          (acc, item) => acc + item.in_stock,
          0
        ),
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

    const inventoryLedgerExisted = await inventoryLedgerRepository.findBy({
      inventory_id: payload.inventory_id,
      status: WarehouseStatus.ACTIVE,
    });

    let physicalWarehouseExisted: WarehouseEntity | undefined;

    if (inventoryLedgerExisted) {
      physicalWarehouseExisted = await warehouseRepository.findBy({
        location_id: locationExisted.id,
        id: inventoryLedgerExisted.warehouse_id,
        status: WarehouseStatus.ACTIVE,
      });
    }

    if (physicalWarehouseExisted) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.EXISTED);
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

    await Promise.all(
      this.nonPhysicalWarehouseTypes.map(
        async (type) =>
          await this.createNonPhysicalWarehouse({
            ...payload,
            type,
            created_by: user.id,
            relation_id: brandId.id,
            parent_id: (physicalWarehouseExisted as WarehouseEntity).id,
            name: (physicalWarehouseExisted as WarehouseEntity).name,
          })
      )
    );

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async updateMultiple(
    user: UserAttributes,
    payload: Record<string, WarehouseUpdate>
  ) {
    const errorMessage: string[] = [];
    await Promise.all(
      map(
        payload,
        async (value, key) => await this.update(user, key, value, errorMessage)
      )
    );

    if (errorMessage.length > 0) {
      return errorMessageResponse(errorMessage.join(", "));
    }

    return successResponse({
      message: MESSAGES.SUCCESS,
    });
  }

  public async updateMultipleBackOrder(
    user: UserAttributes,
    payload: WarehouseUpdateBackOrder[]
  ) {
    const errorMessage: string[] = [];

    await Promise.all(
      payload.map(async (value) => {
        await this.updateMultipleWarehouseByInventoryId(
          user,
          value,
          errorMessage
        );
      })
    );
    if (errorMessage.length > 0) {
      return errorMessageResponse(errorMessage.join(", "));
    }

    return successResponse({
      message: MESSAGES.SUCCESS,
    });
  }

  public async update(
    user: UserAttributes,
    id: string,
    payload: WarehouseUpdate,
    errorMessage: string[],
    isBackOrder = false
  ) {
    const { changeQuantity } = payload;

    if (changeQuantity === 0) {
      return;
    }

    const warehouseInStock = await this.getWarehouseInStock(id);
    if (!warehouseInStock) {
      errorMessage.push(`${id}: ${MESSAGES.WAREHOUSE.IN_STOCK_NOT_FOUND}`);
      return;
    }

    const inventoryLedger = await this.getInventoryLedger(warehouseInStock.id);

    if (!inventoryLedger) {
      errorMessage.push(
        `${warehouseInStock.name}: ${MESSAGES.INVENTORY.NOT_FOUND_LEDGER}`
      );
      return;
    }

    const newQuantity = inventoryLedger.quantity + changeQuantity;
    if (newQuantity < 0) {
      errorMessage.push(
        `${warehouseInStock.name}: ${MESSAGES.WAREHOUSE.LESS_THAN_ZERO}`
      );
      return;
    }
    let warehouseBackOrderId: string = "";
    if (isBackOrder) {
      const warehouseBackOrder = await warehouseRepository.findBy({
        parent_id: warehouseInStock.parent_id,
        type: WarehouseType.BACK_ORDER,
      });

      if (!warehouseBackOrder) {
        errorMessage.push(
          `${warehouseInStock.name}: ${MESSAGES.WAREHOUSE.BACK_ORDER_NOT_FOUND}`
        );
        return;
      }
      warehouseBackOrderId = warehouseBackOrder.id;
    }
    if (warehouseBackOrderId) {
      await this.createInventoryAction(
        warehouseBackOrderId,
        inventoryLedger.inventory_id,
        changeQuantity,
        user.id
      );

      await this.createInventoryAction(
        warehouseBackOrderId,
        inventoryLedger.inventory_id,
        -changeQuantity,
        user.id,
        getInventoryActionDescription(
          InventoryActionDescription.TRANSFER_TO,
          "In Stock"
        )
      );
    }

    await this.updateInventoryLedger(inventoryLedger.id, newQuantity);
    await this.createInventoryAction(
      inventoryLedger.warehouse_id,
      inventoryLedger.inventory_id,
      changeQuantity,
      user.id,
      warehouseBackOrderId
        ? getInventoryActionDescription(
            InventoryActionDescription.TRANSFER_FROM,
            "Back Order"
          )
        : undefined
    );
  }

  public async delete(user: UserAttributes, id: string) {
    const instockWarehouseExisted = await warehouseRepository.find(id);

    if (!instockWarehouseExisted) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    if (
      instockWarehouseExisted.type !== WarehouseType.IN_STOCK ||
      !instockWarehouseExisted?.parent_id
    ) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    if (instockWarehouseExisted.status !== WarehouseStatus.ACTIVE) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.NOT_AVAILABLE);
    }

    const physicalWarehouseExisted = await warehouseRepository.update(
      instockWarehouseExisted.parent_id,
      {
        status: WarehouseStatus.INACTIVE,
      }
    );

    if (!physicalWarehouseExisted) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const nonPhysicalWarehouses = await this.updateNonPhysicalWarehouse({
      created_by: user.id,
      parent_id: physicalWarehouseExisted.id,
    });

    return {
      message: nonPhysicalWarehouses.message,
      statusCode: nonPhysicalWarehouses.statusCode,
    };
  }

  private async updateMultipleWarehouseByInventoryId(
    user: UserAttributes,
    value: WarehouseUpdateBackOrder,
    errorMessage: string[]
  ) {
    const inventoryExisted = await inventoryRepository.find(value.inventoryId);
    if (!inventoryExisted) {
      errorMessage.push(
        `${value.inventoryId}: ${MESSAGES.INVENTORY_NOT_FOUND}`
      );
      return;
    }
    const changeQuantitySum = sumBy(
      Object.values(value.warehouses),
      "changeQuantity"
    );
    const backOrder = inventoryExisted.back_order || 0;
    if (changeQuantitySum > backOrder) {
      errorMessage.push(
        `${value.inventoryId}: ${MESSAGES.WAREHOUSE.SUM_IN_STOCK}`
      );
      return;
    }
    const errorMessageWarehouse: string[] = [];
    await Promise.all(
      map(
        value.warehouses,
        async (valueWarehouse, key) =>
          await this.update(
            user,
            key,
            valueWarehouse,
            errorMessageWarehouse,
            true
          )
      )
    );
    if (errorMessageWarehouse.length) {
      errorMessage.push(errorMessageWarehouse.join(", "));
      return;
    }
    await inventoryRepository.update(value.inventoryId, {
      back_order: backOrder - changeQuantitySum,
    });
  }

  private async getWarehouseInStock(id: string) {
    return await warehouseRepository.findBy({
      id,
      type: WarehouseType.IN_STOCK,
    });
  }

  private async getInventoryLedger(warehouseId: string) {
    return await inventoryLedgerRepository.findBy({
      warehouse_id: warehouseId,
    });
  }

  private async updateInventoryLedger(
    inventoryLedgerId: string,
    newQuantity: number
  ) {
    await inventoryLedgerRepository.update(inventoryLedgerId, {
      quantity: newQuantity,
    });
  }

  private async createInventoryAction(
    warehouseId: string,
    inventoryId: string,
    changeQuantity: number,
    userId: string,
    description?: string
  ) {
    await inventoryActionRepository.create({
      warehouse_id: warehouseId,
      inventory_id: inventoryId,
      quantity: changeQuantity,
      created_by: userId,
      description:
        description ??
        getInventoryActionDescription(InventoryActionDescription.ADJUST),
      type:
        changeQuantity > 0 ? InventoryActionType.IN : InventoryActionType.OUT,
    });
  }
}

export const warehouseService = new WarehouseService();
export default WarehouseService;
