import {
  paginationResponse,
  summaryTableResponse,
} from "@/helpers/response.helper";
import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const subsAttribute = {
  id: Joi.string(),
  name: Joi.string(),
  basis_id: Joi.string(),
  description: Joi.any(),
  description_1: Joi.any(),
  description_2: Joi.any(),
  content_type: Joi.string().allow(""),
  basis: Joi.any(),
  sub_group_id: Joi.any(),
};

export const AttributeGroupResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number().allow(null),
  type: Joi.number().allow(null),
  master: Joi.boolean().allow(null),
  selectable: Joi.boolean().allow(null),
  subs: Joi.array().items({
    id: Joi.string(),
    name: Joi.string(),
    count: Joi.any(),
    subs: Joi.array().items(Joi.object(subsAttribute)),
  }),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};
export const dataResponseAllAttribute = {
  general: Joi.array().items(Joi.object(AttributeGroupResponse)),
  feature: Joi.array().items(Joi.object(AttributeGroupResponse)),
  specification: Joi.array().items(Joi.object(AttributeGroupResponse)),
};

export default {
  getOne: Joi.object({
    data: Joi.object(AttributeGroupResponse),
    statusCode: Joi.number(),
  }) as any,

  getList: Joi.object({
    data: Joi.object({
      // attributes: Joi.array().items(Joi.object(AttributeGroupResponse)),
      attributes: Joi.array().items(Joi.any()),
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
      pagination: Joi.object(paginationResponse),
    }),
    statusCode: Joi.number(),
  }) as any,

  getListContentType: Joi.object({
    data: Joi.object({
      texts: Joi.any(),
      conversions: Joi.any(),
      presets: Joi.any(),
      options: Joi.any(),
      feature_presets: Joi.any(),
    }),
    statusCode: Joi.number(),
  }) as any,

  getAllAttribute: Joi.object({
    data: Joi.object(dataResponseAllAttribute),
    statusCode: Joi.number(),
  }) as any,
};
