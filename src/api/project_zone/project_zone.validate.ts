import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  orderValidation,
} from "../../validate/common.validate";

export default {
  create: {
    payload: {
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is missing")),
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Zone is missing")),
      areas: Joi.array()
        .items(
          Joi.object({
            name: Joi.string()
              .trim()
              .required()
              .error(commonFailValidatedMessageFunction("Area is missing")),
            rooms: Joi.array()
              .items(
                Joi.object({
                  room_name: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room is missing")
                    ),
                  room_id: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room ID is missing")
                    ),
                  room_size: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room Size is missing")
                    ),
                  quantity: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Quantity is missing")
                    ),
                })
              )
              .required()
              .error(commonFailValidatedMessageFunction("Room is missing")),
          })
        )
        .required(),
      // .error(commonFailValidatedMessageFunction("Area is missing")),
    },
  },

  getList: {
    query: Joi.object({
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
      zone_order: orderValidation,
      area_order: orderValidation,
      // room_name_order & room_id_order are the same level
      // just sort one at a time
      room_name_order: orderValidation,
      room_id_order: orderValidation,
    }).custom((value) => ({
      ...value,
      area_order: value.area_order || "ASC",
      room_name_order: value.room_name_order || "ASC",
    })),
  },
  getOne: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project zone is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project zone is required")),
    },
    payload: {
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is missing")),
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Zone is missing")),
      areas: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().trim().allow(""),
            name: Joi.string()
              .trim()
              .required()
              .error(commonFailValidatedMessageFunction("Area is missing")),
            rooms: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().trim().allow(""),
                  room_name: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room is missing")
                    ),
                  room_id: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room ID is missing")
                    ),
                  room_size: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room Size is missing")
                    ),
                  quantity: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Quantity is missing")
                    ),
                })
              )
              .required()
              .error(commonFailValidatedMessageFunction("Room is missing")),
          })
        )
        .required(),
      // .error(commonFailValidatedMessageFunction("Area is missing")),
    },
  },
};
