import { requireStringValidation } from "@/validates/common.validate";
import Joi from "joi";

const InventoryId = {
  id: requireStringValidation("Inventory id"),
};

const InventoryRequest = {
  brand_id: requireStringValidation("Brand id"),
  name: requireStringValidation("Inventory name"),
  image: requireStringValidation("Inventory image"),
  sku: requireStringValidation("Inventory sku"),
  inventory_category_id: requireStringValidation("Inventory category id"),
  description: Joi.string().allow(null),
};

export default {
  get: {
    params: InventoryId,
  },
  getByCategory: {
    params: {
      id: requireStringValidation("Inventory category id"),
    },
  },
  create: {
    payload: InventoryRequest,
  },
  delete: {
    params: InventoryId,
  },
  update: {
    params: InventoryId,
    payload: InventoryRequest,
  },
};
