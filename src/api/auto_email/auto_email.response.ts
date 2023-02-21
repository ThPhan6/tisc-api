import { paginationResponse } from "@/helpers/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const autoEmailResponse = {
  id: Joi.string(),
  topic: Joi.number(),
  targeted_for: Joi.number(),
  topic_key: Joi.string().allow(null),
  targeted_for_key: Joi.string().allow(null),
  title: Joi.string(),
  message: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};

export default {
  getOne: Joi.object({
    data: Joi.object(autoEmailResponse),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      auto_emails: Joi.array().items(Joi.object(autoEmailResponse)),
      pagination: Joi.object(paginationResponse),
    }),
    statusCode: Joi.number(),
  }),
};
