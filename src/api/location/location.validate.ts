import * as Joi from "joi";

export default {
  getStates: {
    params: {
      country_id: Joi.string().required(),
    },
  },
};
