import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Zone is required")),
      areas: Joi.array()
        .items(
          Joi.object({
            name: Joi.string()
              .trim()
              .required()
              .error(commonFailValidatedMessageFunction("Area is required")),
            rooms: Joi.array()
              .items(
                Joi.object({
                  room_name: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room is required")
                    ),
                  room_id: Joi.string()
                    .trim()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Room ID is required")
                    ),
                  room_size: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction(
                        "Room Size is required"
                      )
                    ),
                  quantity: Joi.number()
                    .required()
                    .error(
                      commonFailValidatedMessageFunction("Quantity is required")
                    ),
                })
              )
              .required()
              .error(commonFailValidatedMessageFunction("Room is required")),
          })
        )
        .required()
        .error(commonFailValidatedMessageFunction("Area is required")),
    },
  },

  getList: {
    query: {
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
    },
  },
};
