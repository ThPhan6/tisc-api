import * as Joi from "joi";
import {
  errorMessage,
  orderValidation,
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
              .error(errorMessage("Room is missing")),
          })
        )
        .required(),
    },
  },

  getList: {
    query: Joi.object({
      project_id: requireStringValidation("Project"),
      zone_order: orderValidation,
      area_order: orderValidation,
      // room_name_order & room_id_order are the same level
      // just sort one at a time
      room_name_order: orderValidation,
      room_id_order: orderValidation,
    }).custom((value) => ({
      area_order: value.area_order || "ASC",
      room_name_order: value.room_name_order || "ASC",
    })),
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
              .error(errorMessage("Room is missing")),
          })
        )
        .required(),
    },
  },
};
