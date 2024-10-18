import {
  errorMessage,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";
import { isNil } from "lodash";

const InventoryId = {
  id: requireStringValidation("Inventory id"),
};

const priceRequest = Joi.object({
  unit_price: Joi.number().optional(),
  unit_type: Joi.string().optional(),
})
  .xor("unit_price", "unit_type")
  .with("unit_price", "unit_type")
  .with("unit_type", "unit_price");

const InventoryCreateRequest = {
  sku: requireStringValidation("Inventory sku"),
  inventory_category_id: requireStringValidation("Inventory category id"),
  image: Joi.string().allow(null),
  description: Joi.string().allow(null),
  unit_price: Joi.number()
    .required()
    .min(1)
    .error(errorMessage("Base price must be greater than 0")),
  unit_type: requireStringValidation("Unit type"),
  volume_prices: Joi.array()
    .items(
      Joi.object({
        discount_price: Joi.number().required().min(1),
        min_quantity: Joi.number().required().min(1),
        max_quantity: Joi.number().required().greater(Joi.ref("min_quantity")),
      })
    )
    .allow(null),
};

const InventoryUpdateRequest = {
  image: Joi.string().allow(null),
  sku: Joi.string().allow(null),
  description: Joi.string().allow(null),
  unit_price: Joi.number().min(1).allow(null),
  unit_type: Joi.string().allow(null),
  volume_prices: Joi.object(
    Joi.array()
      .items(
        Joi.object({
          discount_price: Joi.number().required().min(1),
          min_quantity: Joi.number().required().min(1),
          max_quantity: Joi.number()
            .required()
            .greater(Joi.ref("min_quantity")),
        })
          .xor("discount_price", "min_quantity")
          .with("discount_price", "min_quantity")
          .with("min_quantity", "discount_price")
          .xor("discount_price", "max_quantity")
          .with("discount_price", "max_quantity")
          .with("max_quantity", "discount_price")
          .xor("min_quantity", "max_quantity")
          .xor("min_quantity", "max_quantity")
          .xor("max_quantity", "min_quantity")
      )
      .allow(null)
  )
    .xor("unit_price", "unit_type")
    .with("unit_price", "unit_type")
    .with("unit_type", "unit_price"),
};

export default {
  get: {
    params: {
      id: Joi.string().required(),
    },
  },
  getList: {
    query: {
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
    // payload: InventoryUpdateRequest,
    payload: Joi.object(InventoryUpdateRequest)
      .xor("unit_price", "unit_type")
      .with("unit_price", "unit_type")
      .with("unit_type", "unit_price"),
  },
};
