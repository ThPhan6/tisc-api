import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

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
      zone_order: Joi.string().valid("ASC", "DESC"),
      area_order: Joi.string().valid("ASC", "DESC"),
      sort: Joi.string().valid("room_name", "room_id"),
      room_name_order: Joi.string().valid("ASC", "DESC"),
      room_id_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        project_id: value.project_id,
        zone_order: value.zone_order ? value.zone_order : "ASC",
        area_order: value.area_order ? value.area_order : "ASC",
        sort: value.sort ? value.sort : "room_name",
        room_name_order: value.room_name_order ? value.room_name_order : "ASC",
        room_id_order: value.room_id_order ? value.room_id_order : "ASC",
      };
    }),
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
