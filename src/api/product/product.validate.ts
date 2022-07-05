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
            "Keywords is required at least 1 valid data"
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
        .min(1)
        .error(
          commonFailValidatedMessageFunction(
            "Keywords is required at least 1 valid data"
          )
        ),
    },
  },
  getList: {
    query: Joi.object({
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      category_id: Joi.string(),
      collection_id: Joi.string(),
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
