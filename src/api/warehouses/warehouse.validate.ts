import Joi from "joi";

const WarehouseRequest = Joi.object({
  location_id: Joi.string().required(),
  inventory_id: Joi.string().required(),
})
  .unknown(false)
  .min(1);

const WarehouseUpdateMultiple = {
  payload: Joi.object()
    .required()
    .pattern(
      Joi.string().required(),
      Joi.object({
        changeQuantity: Joi.number().strict().required(),
      }).required()
    )
    .unknown(false)
    .min(1),
};

const WarehouseUpdateMultipleBackOrder = {
  payload: Joi.array()
    .items(
      Joi.object({
        warehouses: Joi.object()
          .required()
          .pattern(
            Joi.string().required(),
            Joi.object({
              changeQuantity: Joi.number().strict().required(),
            }).required()
          )
          .unknown(false)
          .min(1),
        inventoryId: Joi.string().required(),
      }).required()
    )
    .required()
    .min(1),
};

export default {
  getList: {
    params: {
      id: Joi.string().required(),
    },
  },
  delete: {
    params: {
      id: Joi.string().required(),
    },
  },

  create: {
    payload: WarehouseRequest,
  },
  updateMultiple: WarehouseUpdateMultiple,
  updateMultipleBackOrder: WarehouseUpdateMultipleBackOrder,
};
