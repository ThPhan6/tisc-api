import { paginationResponse } from "@/helper/response.helper";
import HapiJoi from "joi";
import { designResponse } from "./../designer/designer.response";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const inquiry = {
  title: Joi.string(),
  message: Joi.string(),
  inquiry_for_ids: Joi.array().items(Joi.string().allow(null)),
  inquiries_for: Joi.array().items(Joi.string().allow(null)),
  status: Joi.number(),
  read: Joi.array().items(Joi.string().allow(null)),
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

export const designFirmWithPhoneEmail = {
  ...designResponse,
  email: Joi.string(),
  phone: Joi.string().allow(""),
};

export const inquiryMessage = {
  id: Joi.string(),
  inquiry_for: Joi.string(),
  title: Joi.string(),
  message: Joi.string(),
  product_id: Joi.string(),
  product_collection: Joi.string(),
  product_description: Joi.string().allow(""),
  official_website: Joi.string(),
  product_image: Joi.string(),
};

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      product_name: Joi.string(),
      design_firm: Joi.object(designFirmWithPhoneEmail),
      inquiry_message: Joi.object(inquiryMessage),
    }).allow(null),
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
  create: Joi.object({
    data: Joi.object(inquiry),
    statusCode: Joi.number(),
  }),
};
