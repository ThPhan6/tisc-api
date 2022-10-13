import Joi from "joi";

export default {
  getList: Joi.object({
    data: Joi.array().items(
      Joi.object({
        common_type_id: Joi.string(),
        created_at: Joi.string(),
        created_by: Joi.string(),
        id: Joi.string(),
        model_id: Joi.string(),
        model_name: Joi.string(),
        status: Joi.number(),
        updated_at: Joi.string().allow(null),
        lastname: Joi.string(),
        firstname: Joi.string(),
        action_name: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
