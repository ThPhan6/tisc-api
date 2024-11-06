import Joi from "joi";

export default {
  getList: Joi.object({
    statusCode: Joi.number().required(),
    data: Joi.object({
      total_stock: Joi.number().required(),
      warehouses: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            created_at: Joi.string().required(),
            country_name: Joi.string().allow("").allow(null),
            city_name: Joi.string().allow("").allow(null),
            in_stock: Joi.number().required(),
          })
        )
        .required(),
    }),
  }),
};
