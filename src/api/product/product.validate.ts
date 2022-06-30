import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};
export default {
  create: {
    payload: {
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      collection_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Collection id is required")),
      category_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(commonFailValidatedMessageFunction("Category ids is required")),
      name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Name is required")),
      description: Joi.string(),
      general_attribute_groups: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            attributes: Joi.array().items({
              id: Joi.string(),
              basis_id: Joi.string(),
            }),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "General attribute groups is required"
          )
        ),
      feature_attribute_groups: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            attributes: Joi.array().items({
              id: Joi.string(),
              basis_id: Joi.string(),
            }),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Feature attribute groups is required"
          )
        ),
      specification_attribute_groups: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            attributes: Joi.array().items({
              id: Joi.string(),
              bases: Joi.array().items({
                id: Joi.string(),
                option_code: Joi.string(),
              }),
            }),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Specification attribute groups is required"
          )
        ),
      images: Joi.array()
        .min(3)
        .max(9)
        .items(Joi.string())
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Images is required at least 3 valid data"
          )
        ),
      keywords: Joi.array()
        .items(Joi.string())
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Images is required at least 1 valid data"
          )
        ),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
    payload: {
      brand_id: Joi.string(),
      collection_id: Joi.string(),
      category_ids: Joi.array().items(Joi.string()),
      name: Joi.string(),
      description: Joi.string(),
      general_attribute_groups: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.string(),
          attributes: Joi.array().items({
            id: Joi.string(),
            basis_id: Joi.string(),
          }),
        })
      ),
      feature_attribute_groups: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.string(),
          attributes: Joi.array().items({
            id: Joi.string(),
            basis_id: Joi.string(),
          }),
        })
      ),
      specification_attribute_groups: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.string(),
          attributes: Joi.array().items({
            id: Joi.string(),
            bases: Joi.array().items({
              id: Joi.string(),
              option_code: Joi.string(),
            }),
          }),
        })
      ),
      images: Joi.array().min(3).max(9).items(Joi.string()),
      keywords: Joi.array()
        .items(Joi.string())
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Images is required at least 1 valid data"
          )
        ),
    },
  },
  getList: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(commonFailValidatedMessageFunction("Page must be an integer")),

      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),

      sort: Joi.string(),
      brand_id: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        brand_id: value.brand_id,
        sort: value.sort ? [value.sort, value.order] : undefined,
      };
    }),
  } as any,
  getBrandProductSummary: {
    params: {
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    },
  },
};
