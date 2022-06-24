import * as Joi from "joi";
export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Collection name is required")),
    },
  },
};
