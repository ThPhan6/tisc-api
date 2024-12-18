import { MESSAGES } from "@/constants";
import {
  convertInStock,
  getInventoryActionDescription,
} from "@/helpers/common.helper";
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
  CompanyFunctionalGroup,
  InventoryActionDescription,
  InventoryActionEntity,
  InventoryActionType,
  InventoryLedgerEntity,
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { difference, head, isEmpty, map, pick, sortBy, sumBy } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { locationService } from "../location/location.service";
import {
  MultipleWarehouseRequest,
  NonPhysicalWarehouseCreate,
  WarehouseCreate,
  WarehouseListResponse,
  WarehouseResponse,
  WarehouseUpdate,
  WarehouseUpdateBackOrder,
} from "./warehouse.type";
import { v4 as uuid } from "uuid";
import { getTimestamps } from "@/Database/Utils/Time";

class WarehouseService {
  public nonPhysicalWarehouseTypes = [
    WarehouseType.IN_STOCK,
    WarehouseType.ON_ORDER,
    WarehouseType.BACK_ORDER,
    WarehouseType.DONE,
  ];

  public getInventoryActionType(oldQuantity: number, newQuantity: number) {
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
      type: payload.type,
    });

    if (!existedLedger) {
      if (payload.quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      existedLedger = await inventoryLedgerRepository.create({
        warehouse_id: warehouse.id,
        inventory_id: payload.inventory_id,
        status: WarehouseStatus.ACTIVE,
        type: payload.type,
        quantity: payload.quantity,
      });
    }

    if (!existedLedger) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    if (payload.quantity < 0) {
      return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
    }

    existedLedger = (await inventoryLedgerRepository.update(existedLedger.id, {
      quantity: payload.quantity,
    })) as any;

    if (!existedLedger) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const inventoryAction = await inventoryActionRepository.create({
      warehouse_id: warehouse.id,
      inventory_id: payload.inventory_id,
      quantity: payload.quantity,
      created_by: payload.created_by,
      type: this.getInventoryActionType(
        existedLedger.quantity,
        payload.quantity
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
      "created_by" | "parent_id" | "quantity" | "convert" | "inventory_id"
    >
  ) {
    const {
      created_by: userId,
      parent_id: parentId,
      inventory_id: inventoryId,
      quantity = 0,
      convert = 0,
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

    if (isEmpty(allNonPhysicalWarehouses)) {
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
        allNonPhysicalWarehouses
          .map(
            async (ws) =>
              await warehouseRepository.findAndUpdate(ws.id, {
                status: WarehouseStatus.ACTIVE,
              })
          )
          .filter(Boolean)
      );

      if (
        allNonPhysicalWarehouseUpdated.length !==
        allNonPhysicalWarehouses.length
      ) {
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
      inventory_id: inventoryId,
    });

    if (!existedLedger) {
      if (quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      existedLedger = await inventoryLedgerRepository.create({
        warehouse_id: inStockWarehouse.id,
        inventory_id: inventoryId,
        status: WarehouseStatus.ACTIVE,
        type: WarehouseType.IN_STOCK,
        quantity,
      });
    }

    if (!existedLedger) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE),
        data: null,
      };
    }

    const newQuantity = convertInStock(
      existedLedger.quantity,
      quantity,
      convert
    );

    if (newQuantity === existedLedger.quantity) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }

    if (newQuantity < 0) {
      return {
        ...errorMessageResponse(MESSAGES.LESS_THAN_ZERO),
        data: null,
      };
    }

    const newLedger = await inventoryLedgerRepository.update(existedLedger.id, {
      quantity: newQuantity,
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
      inventory_id: inventoryId,
      quantity,
      created_by: userId,
      type: this.getInventoryActionType(existedLedger.quantity, newQuantity),
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

          const ledgerUpdatePayload: Partial<InventoryLedgerEntity> = {
            status: WarehouseStatus.INACTIVE,
          };

          if (el.type === WarehouseType.IN_STOCK) {
            ledgerUpdatePayload.quantity = 0;
          }

          ledger = (await inventoryLedgerRepository.update(
            prevLedger.id,
            ledgerUpdatePayload
          )) as InventoryLedgerEntity;

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
    user: UserAttributes,
    inventoryId: string,
    _params?: {
      status?: WarehouseStatus;
      type?: WarehouseType;
    }
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

    const brand = await brandRepository.find(category.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const inventoryLedgers = await inventoryLedgerRepository.getAllBy({
      inventory_id: existedInventory.id,
      type: WarehouseType.IN_STOCK,
    });

    const inventoryWarehouses = await warehouseRepository.getWarehouses(
      inventoryLedgers.map((item) => item.warehouse_id)
    );

    const locations = await locationService.getList(user as UserAttributes, {
      sort: "business_name",
      order: "ASC",
      functional_type: CompanyFunctionalGroup.LOGISTIC,
    });

    const warehouses = locations.data.locations.map((location) => {
      const warehouse = inventoryWarehouses.find(
        (ws) => ws.location_id === location.id
      );

      const ledger = inventoryLedgers.find(
        (ledger) => ledger.warehouse_id === warehouse?.id
      );

      if (warehouse) {
        return {
          ...pick(warehouse, ["id", "created_at", "name"]),
          location_id: location.id,
          country_name: location?.country_name ?? "",
          city_name: location?.city_name ?? "",
          in_stock: Number(ledger?.quantity ?? 0),
        };
      }

      return {
        id: location.id,
        name: location.business_name,
        country_name: location?.country_name ?? "",
        city_name: location?.city_name ?? "",
        in_stock: 0,
        location_id: location.id,
        created_at: location.created_at,
      };
    });

    const result = sortBy(warehouses, "name");

    return successResponse({
      data: {
        warehouses: result,
        total_stock: result.reduce((acc, item) => acc + item.in_stock, 0),
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

    const brand = await brandRepository.find(categoryExisted.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const locationExisted = await locationRepository.find(payload.location_id);

    if (!locationExisted) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    if (
      !locationExisted.functional_type
        .toLowerCase()
        .includes(CompanyFunctionalGroup.LOGISTIC.toLowerCase())
    ) {
      return errorMessageResponse(
        `The location ${locationExisted.business_name} is not a ${CompanyFunctionalGroup.LOGISTIC}`
      );
    }

    const allInStockWarehousesBelongToLocations =
      await warehouseRepository.getAllBy({
        location_id: locationExisted.id,
        type: WarehouseType.IN_STOCK,
      });
    const warehouseIds = allInStockWarehousesBelongToLocations.map(
      (item) => item.id
    );
    const ledgers = await inventoryLedgerRepository.getByWarehouses(
      warehouseIds,
      inventoryExisted.id
    );

    const inventoryLedgerExisted = ledgers.find(
      (el: any) => el?.inventory_id === inventoryExisted.id
    );
    if (!inventoryLedgerExisted) {
      if (payload.quantity < 0) {
        return errorMessageResponse(MESSAGES.LESS_THAN_ZERO);
      }

      const existedWarehouse = await warehouseRepository.findBy({
        location_id: locationExisted.id,
        relation_id: brand.id,
      });

      if (existedWarehouse) {
        return successMessageResponse(MESSAGES.SUCCESS);
      }

      const newPhysicalWarehouse = await warehouseRepository.create({
        name: locationExisted.business_name,
        location_id: locationExisted.id,
        parent_id: null,
        relation_id: brand.id,
        type: WarehouseType.PHYSICAL,
        status: WarehouseStatus.ACTIVE,
      });

      if (!newPhysicalWarehouse) {
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
              relation_id: brand.id,
              parent_id: newPhysicalWarehouse.id,
              name: newPhysicalWarehouse.name,
            })
        )
      );

      const res = head(nonPhysicalWarehouses);

      return {
        message: res?.message ?? MESSAGES.SOMETHING_WRONG_CREATE,
        statusCode: res?.statusCode ?? 400,
      };
    }

    const instockWarehouseExisted = allInStockWarehousesBelongToLocations.find(
      (el) => el.id === inventoryLedgerExisted.warehouse_id
    );

    if (!instockWarehouseExisted) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.IN_STOCK_NOT_FOUND);
    }

    if (!instockWarehouseExisted?.parent_id) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const physicalWarehouseExisted = await warehouseRepository.findBy({
      id: instockWarehouseExisted.parent_id,
      type: WarehouseType.PHYSICAL,
    });

    if (!physicalWarehouseExisted) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.NOT_FOUND);
    }

    if (locationExisted.id !== physicalWarehouseExisted?.location_id) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const nonPhysicalWarehouses = await this.updateNonPhysicalWarehouse({
      created_by: user.id,
      parent_id: physicalWarehouseExisted.id,
      quantity: payload.quantity,
      convert: payload.convert,
      inventory_id: inventoryExisted.id,
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

  public async updateWarehouseQuantity(
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

    return successMessageResponse(MESSAGES.SUCCESS);
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

    return successMessageResponse(MESSAGES.SUCCESS);
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

    const warehouseInStock = await warehouseRepository.findBy({
      id,
      type: WarehouseType.IN_STOCK,
    });
    if (!warehouseInStock) {
      errorMessage.push(`${id}: ${MESSAGES.WAREHOUSE.IN_STOCK_NOT_FOUND}`);
      return;
    }

    const inventoryLedger = await inventoryLedgerRepository.findBy({
      warehouse_id: warehouseInStock.id,
    });

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
      const inventoryActionBackOrderInCreated =
        await inventoryActionRepository.create({
          warehouse_id: warehouseBackOrderId,
          inventory_id: inventoryLedger.inventory_id,
          quantity: changeQuantity,
          created_by: user.id,
          description: getInventoryActionDescription(
            InventoryActionDescription.ADJUST
          ),
          type: InventoryActionType.IN,
        });

      if (!inventoryActionBackOrderInCreated) {
        errorMessage.push(
          `${warehouseInStock.name}: ${MESSAGES.SOMETHING_WRONG_CREATE}`
        );
        return;
      }
      const inventoryActionBackOrderOutCreated =
        await inventoryActionRepository.create({
          warehouse_id: warehouseBackOrderId,
          inventory_id: inventoryLedger.inventory_id,
          quantity: -changeQuantity,
          created_by: user.id,
          description: getInventoryActionDescription(
            InventoryActionDescription.TRANSFER_TO,
            "In Stock"
          ),
          type: InventoryActionType.OUT,
        });
      if (!inventoryActionBackOrderOutCreated) {
        errorMessage.push(
          `${warehouseInStock.name}: ${MESSAGES.SOMETHING_WRONG_CREATE}`
        );
        return;
      }
    }

    const inventoryLedgerUpdated = await inventoryLedgerRepository.update(
      inventoryLedger.id,
      {
        quantity: newQuantity,
      }
    );
    if (!inventoryLedgerUpdated) {
      errorMessage.push(
        `${warehouseInStock.name}: ${MESSAGES.SOMETHING_WRONG_UPDATE}`
      );
      return;
    }

    const inventoryActionStockCreated = await inventoryActionRepository.create({
      warehouse_id: inventoryLedger.warehouse_id,
      inventory_id: inventoryLedger.inventory_id,
      quantity: changeQuantity,
      created_by: user.id,
      description: getInventoryActionDescription(
        warehouseBackOrderId
          ? InventoryActionDescription.TRANSFER_FROM
          : InventoryActionDescription.ADJUST,
        warehouseBackOrderId ? "Back Order" : ""
      ),
      type:
        changeQuantity > 0 ? InventoryActionType.IN : InventoryActionType.OUT,
    });
    if (!inventoryActionStockCreated) {
      errorMessage.push(
        `${warehouseInStock.name}: ${MESSAGES.SOMETHING_WRONG_CREATE}`
      );
    }
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
        `${inventoryExisted.sku}: ${MESSAGES.WAREHOUSE.SUM_IN_STOCK}`
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

  public async updateMultiple(payload: Omit<MultipleWarehouseRequest, "id">[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const warehouseUpdated = await warehouseRepository.updateMultiple(
      payload.map((item) => ({
        ...item,
        updated_at: getTimestamps(),
      }))
    );

    return warehouseUpdated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async createMultiple(payload: MultipleWarehouseRequest[]) {
    const warehouseCreated = await warehouseRepository.createMultiple(
      payload.map((item) => ({
        ...item,
        created_at: getTimestamps(),
        updated_at: getTimestamps(),
      }))
    );

    return warehouseCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }
}

export const warehouseService = new WarehouseService();
export default WarehouseService;
