import { paginationResponse } from "@/helpers/response.helper";
import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const inquiryValidate = {
  title: Joi.string(),
  message: Joi.string(),
  inquiry_for_ids: Joi.array().items(Joi.string().allow(null)),
  inquiries_for: Joi.array().items(Joi.string().allow(null)),
  status: Joi.number(),
  read_by: Joi.array().items(Joi.string().allow(null)),
  created_at: Joi.string(),
  created_by: Joi.string(),
  id: Joi.string(),
  updated_at: Joi.string().allow(null),
  product_id: Joi.string(),
};

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      design_firm: Joi.object({
        name: Joi.string(),
        official_website: Joi.string().allow(""),
        general_email: Joi.string().allow(""),
        general_phone: Joi.string().allow(""),
        phone_code: Joi.string().allow(""),
        address: Joi.string().allow(""),
        city_name: Joi.string().allow(""),
        state_name: Joi.string().allow(""),
        country_name: Joi.string().allow(""),
      }),
      inquiry_message: Joi.object({
        id: Joi.string(),
        inquiry_for: Joi.string(),
        title: Joi.string(),
        message: Joi.string(),
        product: Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          description: Joi.string().allow(""),
          collection: Joi.string(),
          image: Joi.string(),
        }),
        designer: Joi.object({
          name: Joi.string().allow(""),
          position: Joi.string().allow(""),
          email: Joi.string().allow(""),
          phone: Joi.string().allow(""),
          phone_code: Joi.string().allow(""),
        }),
      }),
    }).allow(null),
  }) as any,

  getList: Joi.object({
    data: Joi.object({
      general_inquiries: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          created_at: Joi.string(),
          title: Joi.string(),
          status: Joi.number(),
          design_firm: Joi.string(),
          firm_location: Joi.string().allow(""),
          inquirer: Joi.string(),
          inquiry_for: Joi.string(),
          read: Joi.boolean(),
        })
      ),
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
    data: Joi.object(inquiryValidate),
    statusCode: Joi.number(),
  }),
};
