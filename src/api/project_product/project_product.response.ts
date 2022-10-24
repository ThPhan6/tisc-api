import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      summary: Joi.array().items({
        name: Joi.string(),
        value: Joi.number(),
      }),
      considered_products: Joi.array().items(Joi.any()),
    }),
  }) as any,
  getListStatus: Joi.array().items({
    key: Joi.string(),
    value: Joi.number(),
  }),
  getListAssignedProject: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }),
  getSpecifiedProductList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      data: Joi.any(),
      summary: Joi.array().items({
        name: Joi.string(),
        value: Joi.number(),
      }),
    }),
  }) as any,
  getFinishScheduleByRoom: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(Joi.object({
      back_wall: Joi.boolean(),
      base: {
        ceiling: Joi.boolean(),
        floor: Joi.boolean()
      },
      cabinet: {
        carcass: Joi.boolean(),
        door: Joi.boolean()
      },
      ceiling: Joi.boolean(),
      created_at: Joi.string().allow(''),
      created_by: Joi.string().allow(''),
      door: {
        frame: Joi.boolean(),
        panel: Joi.boolean()
      },
      floor: Joi.boolean(),
      front_wall: Joi.boolean(),
      id: Joi.string().allow(''),
      left_wall: Joi.boolean(),
      project_product_id: Joi.string().allow(''),
      right_wall: Joi.boolean(),
      room_id: Joi.string().allow(''),
      updated_at: Joi.string().allow(''),
      updated_by: Joi.string().allow('', null),
      room_id_text: Joi.string().allow(''),
      room_name: Joi.string().allow('')
    }))
  })
};
