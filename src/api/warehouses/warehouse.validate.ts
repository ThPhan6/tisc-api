import Joi from "joi";

const WarehouseRequest = Joi.object({
  id: Joi.string().allow(null),
  quantity: Joi.number().required().default(0),
  relation_id: Joi.string().required(),
  location_id: Joi.string().required(),
  inventory_id: Joi.string().required(),
})
  .unknown(false)
  .min(1);

export default {
  getList: {
    params: {
      id: Joi.string().required(),
    },
  },

  create: {
    payload: WarehouseRequest,
  },
};
