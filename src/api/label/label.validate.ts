import {
  getOneValidation, requireStringValidation
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      name: requireStringValidation("Label").custom((value: string) => value.toLowerCase()),
    },
  },
  update: {
    ...getOneValidation,
    payload: {
      name: requireStringValidation("Label").custom((value: string) => value.toLowerCase()),
    },
  },
};
