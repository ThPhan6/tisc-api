import Joi from "joi";

const InventoryResponse = {
  id: Joi.string().required(),
  inventory_category_id: Joi.string().required(),
  name: Joi.string().required(),
  sku: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().allow(null),
  brand_id: Joi.string().required(),
  created_at: Joi.string().required(),
  updated_at: Joi.string().allow(null),
  deleted_at: Joi.string().allow(null),
};

export default {
  getOne: Joi.object({
    data: Joi.object(InventoryResponse),
    statusCode: Joi.number(),
  }),
};
