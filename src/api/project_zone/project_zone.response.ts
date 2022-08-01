import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getOne: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      project_id: Joi.string(),
      name: Joi.string(),
      areas: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          rooms: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              room_name: Joi.string(),
              room_id: Joi.string(),
              room_size: Joi.number(),
              quantity: Joi.number(),
              sub_total: Joi.number(),
              room_size_unit: Joi.string(),
            })
          ),
        })
      ),
      created_at: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
  getList: Joi.object({
    data: Joi.object({
      project_zones: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          project_id: Joi.string(),
          name: Joi.string(),
          count: Joi.number(),
          areas: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              name: Joi.string(),
              count: Joi.number(),
              rooms: Joi.array().items(
                Joi.object({
                  id: Joi.string(),
                  room_name: Joi.string(),
                  room_id: Joi.string(),
                  room_size: Joi.number(),
                  quantity: Joi.number(),
                  sub_total: Joi.number(),
                  room_size_unit: Joi.string(),
                })
              ),
            })
          ),
          created_at: Joi.string(),
        })
      ),
      summary: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          value: Joi.number(),
        })
      ),
    }),
    statusCode: Joi.number(),
  }),
};
