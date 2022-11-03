import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  requireNumberValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      project_id: requireStringValidation("Project"),
      name: requireStringValidation("Zone"),
      areas: Joi.array()
        .items(
          Joi.object({
            name: requireStringValidation("Area"),
            rooms: Joi.array()
              .items(
                Joi.object({
                  room_name: requireStringValidation("Room"),
                  room_id: requireStringValidation("Room ID"),
                  room_size: requireNumberValidation("Room Size"),
                  quantity: requireNumberValidation("Quantity"),
                })
              )
              .required()
              .error(commonFailValidatedMessageFunction("Room is missing")),
          })
        )
        .required(),
    },
  },

  getList: {
    query: Joi.object({
      project_id: requireStringValidation("Project"),
      zone_order: Joi.string().valid("ASC", "DESC"),
      area_order: Joi.string().valid("ASC", "DESC"),
      room_name_order: Joi.string().valid("ASC", "DESC"),
      room_id_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        project_id: value.project_id,
        zone_order: value.zone_order ? value.zone_order : "ASC",
        area_order: value.area_order ? value.area_order : "ASC",
        room_name_order: value.room_name_order ? value.room_name_order : "",
        room_id_order: value.room_id_order ? value.room_id_order : "",
      };
    }),
  },
  getOne: {
    params: {
      id: requireStringValidation("Project zone"),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Project zone"),
    },
    payload: {
      project_id: requireStringValidation("Project"),
      name: requireStringValidation("Zone"),
      areas: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().trim().allow(""),
            name: requireStringValidation("Area"),
            rooms: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().trim().allow(""),
                  room_name: requireStringValidation("Room"),
                  room_id: requireStringValidation("Room ID"),
                  room_size: requireNumberValidation("Room Size"),
                  quantity: requireNumberValidation("Quantity"),
                })
              )
              .required()
              .error(commonFailValidatedMessageFunction("Room is missing")),
          })
        )
        .required(),
    },
  },
};
