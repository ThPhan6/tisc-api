import { summaryTableResponse } from "@/helper/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const roomResponse = {
  id: Joi.string(),
  room_name: Joi.string(),
  room_id: Joi.string(),
  room_size: Joi.number(),
  quantity: Joi.number(),
  sub_total: Joi.number(),
  room_size_unit: Joi.string(),
};

export const areaResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number().allow(null),
  rooms: Joi.array().items(Joi.object(roomResponse)),
};

export const projectZoneResponse = {
  id: Joi.string(),
  project_id: Joi.string(),
  name: Joi.string(),
  count: Joi.number().allow(null),
  areas: Joi.array().items(areaResponse),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};

export default {
  getOne: Joi.object({
    data: Joi.object(projectZoneResponse),
    statusCode: Joi.number(),
  }) as any,

  getList: Joi.object({
    data: Joi.object({
      project_zones: Joi.array().items(Joi.object(projectZoneResponse)),
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.any(),
        })
      ),
    }),
    statusCode: Joi.number(),
  }),
};
