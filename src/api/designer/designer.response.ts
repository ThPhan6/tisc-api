import { paginationResponse } from "@/helper/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const designResponse = {
  name: Joi.string(),
  parent_company: Joi.string().allow(""),
  logo: Joi.string().allow(null),
  slogan: Joi.string().allow(""),
  profile_n_philosophy: Joi.string().allow(""),
  official_website: Joi.string().allow(""),
  team_profile_ids: Joi.array().items(Joi.string().allow(null)),
  status: Joi.number(),
  id: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};

export default {
  getList: Joi.object({
    data: Joi.object({
      designers: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          logo: Joi.string().allow(null),
          origin: Joi.any(),
          main_office: Joi.any(),
          satellites: Joi.number(),
          designers: Joi.number(),
          capacities: Joi.number(),
          projects: Joi.number(),
          live: Joi.number(),
          on_hold: Joi.number(),
          archived: Joi.number(),
          status: Joi.number(),
        })
      ),
      pagination: Joi.object(paginationResponse),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  getAllDesignSummary: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        quantity: Joi.number(),
        label: Joi.string(),
        subs: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            quantity: Joi.number(),
            label: Joi.string(),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  }),
};
