import { requireStringValidation } from "@/validates/common.validate";
import Joi from "joi";

const InventoryId = {
  id: requireStringValidation("Inventory id"),
};

const InventoryCreateRequest = {
  name: requireStringValidation("Inventory name"),
  sku: requireStringValidation("Inventory sku"),
  inventory_category_id: requireStringValidation("Inventory category id"),
  image: Joi.string().allow(null),
  description: Joi.string().allow(null),
};

const InventoryUpdateRequest = {
  name: Joi.string().allow(null),
  image: Joi.string().allow(null),
  sku: Joi.string().allow(null),
  description: Joi.string().allow(null),
};

export default {
  get: {
    query: {
      id: Joi.string().allow(null),
    },
  },
  getInventoryCategoryList: {
    query: {
      id: Joi.string().allow(null),
      category_id: Joi.string().allow(null),
      limit: Joi.number().allow(null),
      offset: Joi.number().allow(null),
      order: Joi.string().allow(null),
      sort: Joi.string().allow(null),
      search: Joi.string().allow(null),
    },
  },
  create: {
    payload: InventoryCreateRequest,
  },
  delete: {
    params: InventoryId,
  },
  update: {
    params: InventoryId,
    payload: InventoryUpdateRequest,
  },
};
