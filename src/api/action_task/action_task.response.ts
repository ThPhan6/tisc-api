import Joi from "joi";

export default {
  getList: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        created_at: Joi.string(),
        actions: Joi.string(),
        teams: Joi.object({
          id: Joi.string(),
          fistname: Joi.string(),
          lastname: Joi.string(),
        }),
        status: Joi.number(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
