import Joi from "joi";
import {
  getListValidation,
  requireStringValidation,
  errorMessage,
  getOneValidation,
} from "@/validate/common.validate";
import { getEnumValues } from "@/helper/common.helper";
import {CollectionRelation} from '@/types';

export default {
  create: {
    payload: {
      name: requireStringValidation("Collection name"),
      relation_id: requireStringValidation("Relation"),
      relation_type: Joi.number().required()
        .valid(...getEnumValues(CollectionRelation))
        .error(errorMessage("Relation Type is required")),
    },
  },
  update: {
    ...getOneValidation,
    payload: {
      name: requireStringValidation("Collection name"),
    },
  },
  getList: getListValidation({
    query: {
      relation_id: requireStringValidation("Relation"),
      relation_type: Joi.number().required()
        .valid(...getEnumValues(CollectionRelation))
        .error(errorMessage("Relation Type is required")),
    },
  }),
};
