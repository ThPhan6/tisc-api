import {
  summaryTableResponse,
  paginationResponse,
} from "@/helpers/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const categoryResponseValidate = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number().allow(null),
  subs: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      count: Joi.number().allow(null),
      subs: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
        })
      ),
    })
  ),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};
export default {
  category: Joi.object({
    data: Joi.object(categoryResponseValidate),
    statusCode: Joi.number(),
  }) as any,
  categories: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(Joi.object(categoryResponseValidate)),
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
      pagination: Joi.object(paginationResponse),
    }),
    statusCode: Joi.number(),
  }) as any,
};
