import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";


export const productPayloadValidate = {
  brand_id: Joi.string()
    .required()
    .error(commonFailValidatedMessageFunction("Brand id is required")),
  collection_id: Joi.string()
    .required()
    .error(commonFailValidatedMessageFunction("Please select collection")),
  category_ids: Joi.array()
    .items(Joi.string().required())
    .required()
    .error(commonFailValidatedMessageFunction("Please select category")),
  name: Joi.string()
    .required()
    .error(commonFailValidatedMessageFunction("Name is required")),
  description: Joi.string().allow(""),
  general_attribute_groups: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "General attribute title is required"
            )
          ),
        attributes: Joi.array()
          .items({
            id: Joi.string()
              .required()
              .error(
                commonFailValidatedMessageFunction("Attribute is required")
              ),
            basis_id: Joi.string()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "General attribute basis is required"
                )
              ),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "General attribute type is required"
                )
              ),
            text: Joi.any(),
            conversion_value_1: Joi.any(),
            conversion_value_2: Joi.any(),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "General attributes is required"
            )
          ),
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
        name: Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Feature attribute title is required"
            )
          ),
        attributes: Joi.array()
          .items({
            id: Joi.string()
              .required()
              .error(
                commonFailValidatedMessageFunction("Attribute is required")
              ),
            basis_id: Joi.string()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Feature attribute basis is required"
                )
              ),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Feature attribute type is required"
                )
              ),
            text: Joi.any(),
            conversion_value_1: Joi.any(),
            conversion_value_2: Joi.any(),
          })
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Feature attributes is required"
            )
          ),
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
        name: Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Specification attribute name is required"
            )
          ),
        attributes: Joi.array()
          .items({
            id: Joi.string()
              .required()
              .error(
                commonFailValidatedMessageFunction("Attribute is required")
              ),
            basis_id: Joi.any()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Specification attribute basis is required"
                )
              ),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Specification attribute type is required"
                )
              ),
            text: Joi.any(),
            conversion_value_1: Joi.any(),
            conversion_value_2: Joi.any(),
            basis_options: [
              Joi.array().items({
                id: Joi.string(),
                option_code: Joi.string(),
              }),
              Joi.any(),
            ],
          })
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Specification attributes is required"
            )
          ),
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
      commonFailValidatedMessageFunction("Images is required at least 3 valid data")
    ),
  keywords: Joi.array()
    .items(Joi.string().allow(""))
    .required()
    .error(commonFailValidatedMessageFunction("Keywords is required")),
  brand_location_id: Joi.string().allow(""),
  distributor_location_id: Joi.string().allow(""),
  tips: Joi.array().items(
    Joi.object({
      title: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product tip title is required"
          )
        ),
      content: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product tip content is required"
          )
        ),
    })
  ),
  downloads: Joi.array().items(
    Joi.object({
      title: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product tip title is required"
          )
        ),
      url: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product download url is required"
          )
        ),
    })
  ),
  catelogue_downloads: Joi.array().items(
    Joi.object({
      title: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product tip title is required"
          )
        ),
      url: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product download url is required"
          )
        ),
    })
  ),
}

export default {
  create: {
    payload: productPayloadValidate,
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
    payload: productPayloadValidate,
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
  getListDesignerBrandProducts: {
    query: Joi.object({
      category_id: Joi.string(),
      brand_id: Joi.string(),
      name: Joi.string(),
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
    }),
  } as any,
  getBrandProductSummary: {
    params: {
      brand_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    },
  },
  getProductOptions: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
      attribute_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Attribute Id is required")),
    },
  },
  assign: {
    payload: {
      considered_product_id: Joi.string().optional(),
      is_entire: Joi.boolean().required(),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      project_zone_ids: Joi.array().items(Joi.string()),
    },
  },
  shareByEmail: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      sharing_group: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Sharing Group is required")),
      sharing_purpose: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Sharing Purpose is required")
        ),
      to_email: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      message: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),
    },
  },
  publicSharingProduct: {
    query: {
      hash: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Hash is required")),
    },
  },
};
