import * as Joi from "joi";

export default {
  getStates: {
    params: {
      country_id: Joi.string().required(),
    },
  },
  create: {
    payload: {
      business_name: Joi.string().required(),
      business_number: Joi.string().required(),
      functional_type_ids: Joi.array().items(Joi.string()).required(),
      country_id: Joi.string().required(),
      state_id: Joi.string().required(),
      city_id: Joi.string().required(),
      address: Joi.string().required(),
      postal_code: Joi.string().required(),
      general_phone: Joi.string().required(),
      general_email: Joi.string().required(),
    },
  },
};
