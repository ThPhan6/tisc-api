import { getEnumValues } from "@/helper/common.helper";
import { paginationResponse } from "@/helper/response.helper";
import { RespondedOrPendingStatus } from "@/types";
import HapiJoi from "joi";
import { designResponse } from "./../designer/designer.response";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const inquiry = {
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
        general_email: Joi.string(),
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
          description: Joi.string(),
          collection: Joi.string(),
          image: Joi.string(),
        }),
        designer: Joi.object({
          name: Joi.string(),
          position: Joi.string().allow(""),
          email: Joi.string(),
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
    data: Joi.object(inquiry),
    statusCode: Joi.number(),
  }),
};
