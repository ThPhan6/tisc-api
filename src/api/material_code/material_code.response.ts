import { summaryTableResponse } from "./../../helper/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));
export default {
  get: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
  }) as any,
  getMaterialCodes: {
    data: Joi.object({
      material_codes: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          subs: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
              count: Joi.number(),
              codes: Joi.array().items(
                Joi.object({
                  id: Joi.string(),
                  code: Joi.string(),
                  description: Joi.string(),
                })
              ),
            })
          ),
        })
      ),
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
    }),
    statusCode: Joi.number(),
  },
  getListCodeMaterialCode: {
    data: Joi.array().items(
      Joi.object({
        code: Joi.string(),
        description: Joi.string(),
        id: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  },
};
