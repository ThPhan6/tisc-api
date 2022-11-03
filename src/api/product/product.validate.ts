import * as Joi from "joi";
import {
  errorMessage,
  requireStringValidation,
} from "@/validate/common.validate";

export const productPayloadValidate = {
  brand_id: requireStringValidation("Brand id"),
  collection_id: requireStringValidation("Collection"),
  category_ids: Joi.array()
    .items(Joi.string().required())
    .required()
    .error(errorMessage("Please select category")),
  name: requireStringValidation("Name"),
  description: Joi.string().allow(""),
  general_attribute_groups: Joi.array()
    .items(
      Joi.object({
        name: requireStringValidation("General attribute title"),
        attributes: Joi.array()
          .items({
            id: requireStringValidation("Attribute"),
            basis_id: requireStringValidation("General attribute basis"),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(errorMessage("General attribute type is required")),
            text: Joi.any(),
            conversion_value_1: Joi.any(),
            conversion_value_2: Joi.any(),
          })
          .required()
          .error(errorMessage("General attributes is required")),
      })
    )
    .required()
    .error(errorMessage("General attribute groups is required")),
  feature_attribute_groups: Joi.array()
    .items(
      Joi.object({
        name: requireStringValidation("Feature attribute title"),
        attributes: Joi.array()
          .items({
            id: requireStringValidation("Attribute"),
            basis_id: requireStringValidation("Feature attribute basis"),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(errorMessage("Feature attribute type is required")),
            text: Joi.any(),
            conversion_value_1: Joi.any(),
            conversion_value_2: Joi.any(),
          })
          .required()
          .error(errorMessage("Feature attributes is required")),
      })
    )
    .required()
    .error(errorMessage("Feature attribute groups is required")),
  specification_attribute_groups: Joi.array()
    .items(
      Joi.object({
        name: requireStringValidation("Specification attribute name"),
        attributes: Joi.array()
          .items(
            Joi.object({
              id: requireStringValidation("Attribute"),
              basis_id: Joi.any()
                .required()
                .error(
                  errorMessage("Specification attribute basis is required")
                ),
              basis_value_id: Joi.any(),
              type: Joi.string()
                .valid("Text", "Conversions", "Presets", "Options")
                .required()
                .error(
                  errorMessage("Specification attribute type is required")
                ),
              text: Joi.any(),
              conversion_value_1: Joi.any(),
              conversion_value_2: Joi.any(),
              basis_options: [
                Joi.array().items(
                  Joi.object({
                    id: Joi.string(),
                    option_code: Joi.string(),
                  })
                ),
                Joi.any(),
              ],
            })
          )
          .required()
          .error(errorMessage("Specification attributes is required")),
      })
    )
    .required()
    .error(errorMessage("Specification attribute groups is required")),
  images: Joi.array()
    .min(3)
    .max(9)
    .items(Joi.string())
    .required()
    .error(errorMessage("Images is required at least 3 valid data")),
  keywords: Joi.array()
    .items(Joi.string().allow(""))
    .required()
    .error(errorMessage("Keywords is required")),
  brand_location_id: Joi.string().allow(""),
  distributor_location_id: Joi.string().allow(""),
  tips: Joi.array().items(
    Joi.object({
      title: requireStringValidation("Product tip title"),
      content: requireStringValidation("Product tip content"),
    })
  ),
  downloads: Joi.array().items(
    Joi.object({
      title: requireStringValidation("Product tip title"),
      url: requireStringValidation("Product download url"),
    })
  ),
  catelogue_downloads: Joi.array().items(
    Joi.object({
      title: requireStringValidation("Product tip title"),
      url: requireStringValidation("Product download url"),
    })
  ),
};

export default {
  create: {
    payload: productPayloadValidate,
  },
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: productPayloadValidate,
  },
  getList: {
    query: Joi.object({
      brand_id: requireStringValidation("Brand id"),
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
      brand_id: requireStringValidation("Brand id"),
    },
  },
  getProductOptions: {
    params: {
      id: requireStringValidation("Id"),
      attribute_id: requireStringValidation("Attribute Id"),
    },
  },
  assign: {
    payload: {
      considered_product_id: Joi.string().optional(),
      is_entire: Joi.boolean().required(),
      product_id: requireStringValidation("Product id"),
      project_id: requireStringValidation("Project id"),
      project_zone_ids: Joi.array().items(Joi.string()),
    },
  },
  shareByEmail: {
    payload: {
      product_id: requireStringValidation("Product id"),
      sharing_group: requireStringValidation("Sharing Group"),
      sharing_purpose: requireStringValidation("Sharing Purpose"),
      to_email: requireStringValidation("Email"),
      title: requireStringValidation("Title"),
      message: requireStringValidation("Message"),
    },
  },
  publicSharingProduct: {
    query: {
      hash: requireStringValidation("Hash"),
    },
  },
};
