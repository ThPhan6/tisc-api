import * as Joi from "joi";
import { getListValidation, orderValidation } from "@/validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(() => new Error("Main category is missing")),
      subs: Joi.array()
        .items(
          Joi.object({
            name: Joi.string()
              .trim()
              .required()
              .error(() => new Error("Subs category is missing")),
            subs: Joi.array()
              .items({
                name: Joi.string()
                  .trim()
                  .required()
                  .error(() => new Error("Category is missing")),
              })
              .required()
              .error(() => new Error("Category is missing")),
          })
        )
        .required()
        .error(() => new Error("Subs category is missing")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Category id is required")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(() => new Error("Main category is missing")),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().allow(null),
            name: Joi.string()
              .trim()
              .required()
              .error(() => new Error("Subs category is missing")),
            subs: Joi.array()
              .items({
                id: Joi.string().allow(null),
                name: Joi.string()
                  .trim()
                  .required()
                  .error(() => new Error("Category is missing")),
              })
              .required()
              .error(() => new Error("Category is missing")),
          })
        )
        .required()
        .error(() => new Error("Subs category is missing")),
    },
  },
  getListCategory: getListValidation({
    noSorting: true,
    query: {
      haveProduct: Joi.bool().allow(null),
      main_category_order: orderValidation,
      sub_category_order: orderValidation,
      category_order: orderValidation,
    },
    custom: (value) => ({
      main_category_order: value.main_category_order || "ASC",
      sub_category_order: value.sub_category_order || "ASC",
      category_order: value.category_order || "ASC",
    }),
  }),
};
