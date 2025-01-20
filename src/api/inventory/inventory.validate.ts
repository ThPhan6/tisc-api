import {
  getListValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const InventoryId = Joi.object({
  id: requireStringValidation("Inventory id"),
});

const volumePricesSchema = Joi.array()
  .allow(null)
  .items(
    Joi.object({
      discount_rate: Joi.number().strict().min(0).max(100).required().messages({
        "number.base": "Discount rate must be a number.",
        "number.min": "Discount rate cannot be less than 0.",
        "number.max": "Discount rate cannot exceed 100.",
        "any.required": "Discount rate is required.",
      }),
      min_quantity: Joi.number().strict().min(1).required().messages({
        "number.base": "Minimum quantity must be a number.",
        "any.required": "Minimum quantity is required.",
        "number.min": "Minium quantity cannot be less than 1.",
      }),
      max_quantity: Joi.number()
        .strict()
        .greater(Joi.ref("min_quantity"))
        .required()
        .messages({
          "number.base": "Maximum quantity must be a number.",
          "number.greater":
            "Maximum quantity must be greater than minimum quantity.",
          "any.required": "Maximum quantity is required.",
        }),
    })
      .and("discount_rate", "min_quantity", "max_quantity")
      .min(1)
      .unknown(false)
  );

const InventoryCreateRequest = Joi.object({
  sku: requireStringValidation("Inventory sku").trim(),
  inventory_category_id: requireStringValidation("Inventory category id"),
  image: Joi.string().allow(null).allow(""),
  description: Joi.string().allow(null).allow("").trim(),
  unit_price: Joi.number().min(1).strict().required().messages({
    "any.required": "Unit price is required",
    "any.min": "Unit price is must be greater than 0",
  }),
  on_order: Joi.number().min(0).strict().messages({
    "number.min": "On order is must be positive number",
  }),
  back_order: Joi.number().min(0).strict().messages({
    "number.min": "Backorder is must be positive number",
  }),
  unit_type: requireStringValidation("Unit type").not("").not(null),
  volume_prices: volumePricesSchema,
  warehouses: Joi.array()
    .allow(null)
    .items(
      Joi.object({
        location_id: requireStringValidation("Location id"),
        quantity: Joi.number().strict().min(0).required().messages({
          "any.required": "In stock is required",
          "number.min": "In stock is must be positive number",
        }),
      }).unknown(false)
    ),
})
  .min(1)
  .unknown(false)
  .and("unit_price", "unit_type", "volume_prices")
  .messages({
    "object.and":
      "Unit price, unit type, and volume prices must all be provided together.",
  });

const InventoryUpdateRequest = Joi.object({
  image: Joi.string().allow(null).allow(""),
  sku: Joi.string().allow(null).trim(),
  description: Joi.string().allow(null).allow("").trim(),
  unit_price: Joi.number().strict().not(null),
  on_order: Joi.number().min(0).strict().messages({
    "number.min": "On order is must be positive number",
  }),
  back_order: Joi.number().min(0).strict().messages({
    "number.min": "Backorder is must be positive number",
  }),
  unit_type: Joi.string().not("").not(null),
  volume_prices: volumePricesSchema,
  warehouses: Joi.array()
    .allow(null)
    .items(
      Joi.object({
        location_id: requireStringValidation("Location id"),
        quantity: Joi.number().strict().min(0).required().messages({
          "any.required": "In stock is required",
          "number.min": "In stock is must be positive number",
        }),
        convert: Joi.number().strict().allow(null),
      }).unknown(false)
    ),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "At least one field must be provided.",
  })
  .and("unit_price", "volume_prices")
  .messages({
    "object.and":
      "Unit price, and volume prices must all be provided together.",
  });

const InventoryImportRequest = Joi.object({
  sku: requireStringValidation("Inventory sku").trim(),
  inventory_category_id: requireStringValidation("Inventory category id"),
  image: Joi.string().allow(null).allow(""),
  description: Joi.string().allow(null).allow("").trim(),
  unit_type: Joi.string().allow(null).allow(""),
  unit_price: Joi.number().min(1).strict().messages({
    "any.min": "Unit price is must be greater than 0",
  }),
  on_order: Joi.number().min(0).strict().messages({
    "number.min": "On order is must be positive number",
  }),
  back_order: Joi.number().min(0).strict().messages({
    "number.min": "Backorder is must be positive number",
  }),
  volume_prices: volumePricesSchema,
  warehouses: Joi.array()
    .allow(null)
    .items(
      Joi.object({
        location_id: Joi.string().strict().required(),
        quantity: Joi.number().strict().min(0).required().messages({
          "any.required": "In stock is required",
          "number.min": "In stock is must be positive number",
        }),
        convert: Joi.number().strict().allow(null),
      }).unknown(false)
    ),
})
  .min(1)
  .unknown(false);

export default {
  get: {
    params: {
      id: Joi.string().required(),
    },
  },
  getList: getListValidation({
    query: {
      category_id: Joi.string().allow(null),
      limit: Joi.number().allow(null),
      offset: Joi.number().allow(null),
      order: Joi.string().allow(null),
      sort: Joi.string().allow(null),
      search: Joi.string().allow(null),
      is_get_warehouse: Joi.boolean().allow(null),
    },
    custom: (value) => ({
      sort: value.sort || "sku",
      order: value.order || "DESC",
    }),
  }),
  create: {
    payload: InventoryCreateRequest,
  },
  export: {
    payload: Joi.object({
      types: Joi.array().required().items(Joi.number().required()).min(1),
      category_id: requireStringValidation("Category id"),
    })
      .unknown(false)
      .min(1)
      .required(),
  },
  import: {
    payload: Joi.array().required().items(InventoryImportRequest).min(1),
  },
  delete: {
    params: InventoryId,
  },
  update: {
    params: InventoryId,
    payload: InventoryUpdateRequest,
  },
  updateInventories: {
    payload: Joi.object()
      .pattern(
        Joi.string().required(),
        Joi.object({
          unit_price: Joi.number().strict(),
          on_order: Joi.number().min(0).strict().messages({
            "number.min": "On order is must be positive number",
          }),
          back_order: Joi.number().min(0).strict().messages({
            "number.min": "Backorder is must be positive number",
          }),
          volume_prices: volumePricesSchema,
        })
      )
      .unknown(false)
      .min(1),
  },
  exchange: {
    params: Joi.object({
      id: Joi.string().required(),
    })
      .unknown(false)
      .min(1),
    payload: Joi.object({
      to_currency: Joi.string().required(),
    })
      .unknown(false)
      .min(1),
  },
  getSummary: {
    params: Joi.object({
      id: Joi.string().required(),
    })
      .unknown(false)
      .min(1),
  },
  move: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    payload: {
      categoryId: Joi.string().required(),
    },
  },
};
