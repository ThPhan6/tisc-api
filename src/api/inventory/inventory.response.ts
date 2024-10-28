import Joi from "joi";

const exchangeHistorySchema = Joi.object({
  id: Joi.string().required(),
  from_currency: Joi.string().required(),
  to_currency: Joi.string().required(),
  rate: Joi.number().required(),
  relation_id: Joi.string().required(),
  created_at: Joi.string().required(),
  updated_at: Joi.string().required(),
});

const InventoryResponse = {
  id: Joi.string().required(),
  inventory_category_id: Joi.string().required(),
  sku: Joi.string().required(),
  image: Joi.object({
    large: Joi.string().allow(null).allow(""),
    small: Joi.string().allow(null).allow(""),
  }).allow(null),
  description: Joi.string().allow(null).allow(""),
  created_at: Joi.string().required(),
  updated_at: Joi.string().allow(null),
  price: Joi.object({
    id: Joi.string().required(),
    currency: Joi.string().required(),
    unit_price: Joi.number().required(),
    unit_type: Joi.string().required(),
    inventory_id: Joi.string().required(),
    created_at: Joi.string().required(),
    exchange_histories: Joi.array().allow(null).items(exchangeHistorySchema),
    volume_prices: Joi.array()
      .allow(null)
      .items(
        Joi.object({
          id: Joi.string().required(),
          inventory_base_price_id: Joi.string().required(),
          created_at: Joi.string().required(),
          updated_at: Joi.string().required(),
          discount_rate: Joi.number().required(),
          discount_price: Joi.number().allow(null),
          max_quantity: Joi.number().required(),
          min_quantity: Joi.number().required(),
        })
      ),
  }).required(),
};

export default {
  getOne: Joi.object({
    data: Joi.object(InventoryResponse),
    statusCode: Joi.number().required(),
  }),
  ///
  getList: Joi.object({
    data: Joi.object({
      inventories: Joi.array().items(InventoryResponse).allow(null),
      pagination: Joi.object({
        page: Joi.number().required(),
        page_size: Joi.number().required(),
        total: Joi.number().required(),
        page_count: Joi.number().required(),
      }).required(),
    }).required(),
    statusCode: Joi.number().required(),
  }).required(),
  ///
  getSummary: Joi.object({
    statusCode: Joi.number().required(),
    data: Joi.object({
      total_product: Joi.number().required(),
      total_stock: Joi.number().required(),
      currencies: Joi.array()
        .items(
          Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
          })
        )
        .required(),
      exchange_history: exchangeHistorySchema.required(),
    }).required(),
  }).required(),
};
