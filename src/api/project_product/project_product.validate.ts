import * as Joi from "joi";

export default {
  assignProductToProject: {
    payload: {
      is_entire: Joi.boolean().required(),
      product_id: Joi.boolean().required(),
      project_id: Joi.boolean().required(),
      project_zone_ids: Joi.array().items(Joi.string()),
    },
  },
};
