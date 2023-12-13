import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const dimensionWeightResponse = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  with_diameter: Joi.boolean(),
  attributes: Joi.array().items(
    Joi.object({
      basis_id: Joi.string().allow(null, ""),
      basis_value_id: Joi.string().allow(null, ""),
      conversion_value_1: Joi.any(),
      conversion_value_2: Joi.any(),
      id: Joi.string(),
      name: Joi.string(),
      text: Joi.string().allow(null, ""),
      type: Joi.string().allow(null, ""),
      with_diameter: Joi.boolean().allow(null),
      conversion: Joi.object({
        formula_1: Joi.any(),
        formula_2: Joi.any(),
        id: Joi.string(),
        name_1: Joi.string(),
        name_2: Joi.string(),
        unit_1: Joi.string(),
        unit_2: Joi.string(),
      }),
    })
  ),
});

export const userProductSpecificationResponse = {
  is_refer_document: Joi.bool(),
  attribute_groups: Joi.array().items({
    id: Joi.string(),
    attributes: Joi.array().items({
      id: Joi.string(),
      basis_option_id: Joi.string(),
    }),
  }),
};

export const productResponse = {
  id: Joi.string(),
  brand_id: Joi.string(),
  collection_id: Joi.any(),
  collection_ids: Joi.any(),
  category_ids: Joi.array().items(Joi.any()),
  name: Joi.string(),
  code: Joi.any(),
  description: Joi.any(),
  general_attribute_groups: Joi.array().items(Joi.any()),
  feature_attribute_groups: Joi.array().items(Joi.any()),
  specification_attribute_groups: Joi.array().items(Joi.any()),
  favorites: Joi.number(),
  images: Joi.any(),
  keywords: Joi.array().items(Joi.string().allow("")),
  brand_location_id: Joi.any(),
  distributor_location_id: Joi.any(),
  created_at: Joi.any(),
  created_by: Joi.any(),
  is_liked: Joi.boolean(),
  brand: Joi.any(),
  collection: Joi.any(),
  collections: Joi.any(),
  categories: Joi.array().items(
    Joi.object({
      id: Joi.any(),
      name: Joi.any(),
    })
  ),
  updated_at: Joi.string().allow(null),
  tips: Joi.any(),
  downloads: Joi.any(),
  catelogue_downloads: Joi.any(),
  dimension_and_weight: dimensionWeightResponse,
  detected_color_images: Joi.any(),
};

export default {
  getList: Joi.object({
    data: Joi.object({
      data: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          description: Joi.any(),
          type: Joi.any(),
          count: Joi.number(),
          products: Joi.array().items(Joi.object(productResponse)),
        })
      ),
      brand: Joi.any(),
    }),
    statusCode: Joi.number(),
  }),
  getListDesignerProducts: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        description: Joi.any(),
        count: Joi.number(),
        brand_logo: Joi.string().allow(null),
        products: Joi.array().items(Joi.object(productResponse)),
      })
    ),
    allProducts: Joi.array().items(Joi.object(productResponse)),
    brand_summary: Joi.object({
      brand_name: Joi.string(),
      brand_logo: Joi.string().allow(""),
      collection_count: Joi.number(),
      card_count: Joi.number(),
      product_count: Joi.number(),
    }),
    pagination: Joi.any(),
    statusCode: Joi.number(),
  }),
  brandProductSummary: Joi.object({
    data: Joi.object({
      categories: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          name: Joi.any(),
        })
      ),
      collections: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          description: Joi.any(),
          type: Joi.any(),
        })
      ),
      category_count: Joi.number(),
      collection_count: Joi.number(),
      card_count: Joi.number(),
      product_count: Joi.number(),
    }),
    statusCode: Joi.number(),
  }),
  getOne: Joi.object({
    data: Joi.object(productResponse),
    statusCode: Joi.number(),
  }),
  getListRestCollectionProduct: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        collection_id: Joi.any(),
        collection_ids: Joi.any(),
        name: Joi.string(),
        images: Joi.any(),
        created_at: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
  getProductOptions: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.any(),
      value_1: Joi.any(),
      value_2: Joi.any(),
      option_code: Joi.any(),
      image: Joi.any(),
    }),
    statusCode: Joi.number(),
  }),
  commonTypes: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
};
