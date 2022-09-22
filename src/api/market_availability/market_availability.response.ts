import { paginationResponseValidate } from "@/helper/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.object({
      collections: Joi.array().items(Joi.any()),
      pagination: Joi.object(paginationResponseValidate),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getMarketAvailabilityGroupByCollection: {
    data: Joi.array().items(
      Joi.object({
        collection_name: Joi.string(),
        count: Joi.number(),
        regions: Joi.array().items(
          Joi.object({
            region_name: Joi.string(),
            count: Joi.number(),
            region_country: Joi.string().allow(""),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  },
};
