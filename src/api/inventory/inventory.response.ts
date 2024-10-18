import Joi from "joi";

const InventoryResponse = {
  id: Joi.string().required(),
  inventory_category_id: Joi.string().required(),
  sku: Joi.string().required(),
  image: Joi.string().allow(null),
  description: Joi.string().allow(null),
  created_at: Joi.string().required(),
  updated_at: Joi.string().allow(null),
  price: Joi.object({
    id: Joi.string().required(),
    unit_price: Joi.number().required(),
    unit_type: Joi.string().required(),
    inventory_id: Joi.string().required(),
    created_at: Joi.string().required(),
  }),
};

export default {
  getOne: Joi.object({
    data: Joi.object(InventoryResponse),
    statusCode: Joi.number(),
  }),
  getList: Joi.object({
    data: Joi.array().items(Joi.object(InventoryResponse)).required(),
    pagination: Joi.object({
      page: Joi.number().required(),
      page_size: Joi.number().required(),
      total: Joi.number().required(),
      page_count: Joi.number().required(),
    }).required(),
    statusCode: Joi.number().required(),
  }).required(),
};
