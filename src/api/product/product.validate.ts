import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
  stringValidation,
} from "@/validates/common.validate";
import { getEnumValues } from "@/helpers/common.helper";
import { DimensionAndWeightAttributeId } from "@/constants";

export const validateShareProduct = {
  payload: {
    product_id: requireStringValidation("Product id"),
    sharing_group: requireStringValidation("Sharing Group"),
    sharing_purpose: requireStringValidation("Sharing Purpose"),
    to_email: requireStringValidation("Email"),
    title: requireStringValidation("Title"),
    message: requireStringValidation("Message"),
    custom_product: Joi.boolean().allow(null),
  },
};
const attributeGroupsValidate = (
  type: "General" | "Feature" | "Specification"
) => {
  const isSpec = type === "Specification";
  return Joi.array()
    .items(
      Joi.object({
        id: stringValidation(),
        steps: Joi.array().items(
          Joi.object({
            name: Joi.string(),
            order: Joi.number().min(1),
            options: Joi.array().items({
              id: Joi.string(),
              pre_option: Joi.any(),
              replicate: Joi.number().min(0),
            }),
          })
        ),
        defaultPreSelect: Joi.any(),
        name: requireStringValidation(`${type} attribute title`),
        selection: Joi.boolean().allow(null),
        attributes: Joi.array()
          .items({
            id: requireStringValidation("Attribute"),
            basis_id: isSpec
              ? Joi.any()
                  .required()
                  .error(
                    errorMessage("Specification attribute basis is required")
                  )
              : requireStringValidation(`${type} attribute basis`),
            basis_value_id: Joi.any(),
            type: Joi.string()
              .valid("Text", "Conversions", "Presets", "Options")
              .required()
              .error(errorMessage(`${type} attribute type is required`)),
            text: Joi.any(),
            conversion_value_1: Joi.number().allow(""),
            conversion_value_2: Joi.number().allow(""),
            basis_options: isSpec
              ? Joi.array().items(
                  Joi.object().keys({
                    id: Joi.string().error(
                      errorMessage(`${type} Option Product is required`)
                    ),
                    option_code: Joi.string().allow(null, ""),
                  })
                )
              : Joi.any(),
          })
          .required(),
      })
    )
    .required();
};

export const dimensionAndWeightValidate = Joi.object({
  with_diameter: Joi.boolean(),
  attributes: Joi.array().items(
    Joi.object({
      id: Joi.string()
        .valid(...getEnumValues(DimensionAndWeightAttributeId))
        .error(errorMessage("Incorrect Dimension & Weight Attribute")),
      conversion_value_1: Joi.number()
        .allow("")
        .error(errorMessage("Conversation value must be a number")),
      conversion_value_2: Joi.number()
        .allow("")
        .error(errorMessage("Conversation value must be a number")),
    })
  ),
});

export const productPayloadValidate = {
  brand_id: requireStringValidation("Brand id"),
  collection_ids: Joi.array()
    .items(Joi.string().required())
    .required()
    .error(errorMessage("Please select collection")),
  label_ids: Joi.array().items(Joi.string()),
  category_ids: Joi.array()
    .items(Joi.string().required())
    .required()
    .error(errorMessage("Please select category")),
  name: requireStringValidation("Name"),
  description: Joi.string().allow(""),
  general_attribute_groups: attributeGroupsValidate("General"),
  feature_attribute_groups: attributeGroupsValidate("Feature"),
  specification_attribute_groups: attributeGroupsValidate("Specification"),
  images: Joi.array()
    .min(1)
    .max(4)
    .items(Joi.string())
    .required()
    .error(errorMessage("Images is required at least 1 valid data")),
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
  dimension_and_weight: dimensionAndWeightValidate,
  product_information: Joi.object({
    product_name: Joi.string().allow(""),
    product_id: Joi.string().allow(""),
  }),
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
  getListDesignerBrandProducts: getListValidation({
    query: {
      category_id: Joi.string(),
      brand_id: Joi.string(),
      name: Joi.string(),
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
    },
    listType: "designer_brand_products",
  }) as any,
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
  shareByEmail: validateShareProduct,
  publicSharingProduct: {
    query: {
      hash: requireStringValidation("Hash"),
    },
  },
};
