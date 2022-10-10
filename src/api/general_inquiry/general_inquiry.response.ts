import { paginationResponse } from "@/helper/response.helper";
import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const inquiry = {
  title: Joi.string(),
  message: Joi.string(),
  inquiry_for_id: Joi.string(),
  status: Joi.number(),
  read: Joi.array().items(Joi.string()),
  created_at: Joi.string(),
  created_by: Joi.string(),
  id: Joi.string(),
  updated_at: Joi.string().allow(null),
  product_id: Joi.string(),
};

export const inquires = {
  ...inquiry,
  inquirer: Joi.string(),
  state_name: Joi.string().allow(null),
  inquiry_for: Joi.string(),
  country_name: Joi.string().allow(null),
  design_firm: Joi.string(),
  firm_location: Joi.string().allow(""),
};

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object(inquiry),
  }) as any,

  getList: Joi.object({
    data: Joi.object({
      general_inquiries: Joi.array().items(Joi.object(inquires)),
      pagination: paginationResponse,
    }),
    statusCode: Joi.number(),
  }),

  getSummary: Joi.object({
    inquires: Joi.number(),
    pending: Joi.number(),
    responded: Joi.number(),
  }) as any,
};
