import { paginationResponse } from "@/helper/response.helper";
import HapiJoi from "joi";
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

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      product_name: Joi.string(),
      design_firm: Joi.object({
        created_at: Joi.string(),
        id: Joi.string(),
        logo: Joi.string().allow(null),
        name: Joi.string(),
        official_website: Joi.string().allow(""),
        parent_company: Joi.string().allow(""),
        profile_n_philosophy: Joi.string().allow(""),
        slogan: Joi.string().allow(""),
        status: Joi.number(),
        team_profile_ids: Joi.array().items(Joi.string().allow(null)),
        updated_at: Joi.string().allow(null),
        email: Joi.string(),
        phone: Joi.string().allow(""),
      }),
      inquiry_message: Joi.object({
        id: Joi.string(),
        inquiry_for: Joi.string(),
        title: Joi.string(),
        message: Joi.string(),
        product_id: Joi.string(),
        product_collection: Joi.string(),
        product_description: Joi.string(),
        official_website: Joi.string(),
        product_image: Joi.string(),
      }),
    }),
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
