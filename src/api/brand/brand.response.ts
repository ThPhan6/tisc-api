import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  getList: Joi.object({
    data: Joi.object({
      brands: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          name: Joi.string(),
          logo: Joi.string(),
          origin: Joi.string().allow("", null),
          locations: Joi.number(),
          teams: Joi.number(),
          distributors: Joi.number(),
          coverages: Joi.number(),
          categories: Joi.number(),
          collections: Joi.number(),
          cards: Joi.number(),
          products: Joi.number(),
          assign_team: Joi.any(),
          status: Joi.number(),
          status_key: Joi.any(),
          created_at: Joi.string(),
          updated_at: Joi.string().allow(null),
        })
      ),
      pagination: Joi.object({
        page: Joi.number(),
        page_size: Joi.number(),
        total: Joi.number(),
        page_count: Joi.number(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getAllByAlphabet: Joi.object({
    data: Joi.object({
      abc: Joi.array().items(Joi.any()),
      def: Joi.array().items(Joi.any()),
      ghi: Joi.array().items(Joi.any()),
      jkl: Joi.array().items(Joi.any()),
      mno: Joi.array().items(Joi.any()),
      pqr: Joi.array().items(Joi.any()),
      stuv: Joi.array().items(Joi.any()),
      wxyz: Joi.array().items(Joi.any()),
    }),
    statusCode: Joi.number(),
  }) as any,
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }) as any,
  brandProfile: Joi.object({
    data: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      parent_company: Joi.any(),
      logo: Joi.any(),
      slogan: Joi.any(),
      mission_n_vision: Joi.string(),
      official_websites: Joi.array().items({
        country_id: Joi.string(),
        url: Joi.string(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getBrandCards: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
      logo: Joi.any(),
      country: Joi.string(),
      category_count: Joi.number(),
      collection_count: Joi.number(),
      card_count: Joi.number(),
      teams: Joi.array().items({
        id: Joi.string(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        avatar: Joi.any(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  logo: Joi.object({
    data: Joi.object({
      url: Joi.string(),
    }),
    statusCode: Joi.number(),
  }) as any,
};
