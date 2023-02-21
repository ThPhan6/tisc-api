import Joi from "joi";

export const getSummaryResponseValidate = (extra?: Joi.PartialSchemaMap<any>) =>
  Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        quantity: Joi.number(),
        label: Joi.string(),
        subs: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            quantity: Joi.number(),
            label: Joi.string(),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
    ...extra,
  });
