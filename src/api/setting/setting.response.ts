import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

const countryData = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  iso3: Joi.string(),
  iso2: Joi.string(),
  numeric_code: Joi.any(),
  phone_code: Joi.string(),
  capital: Joi.any(),
  currency: Joi.string(),
  currency_name: Joi.string(),
  currency_symbol: Joi.string(),
  tld: Joi.string(),
  native: Joi.any(),
  region: Joi.any(),
  subregion: Joi.any(),
  timezones: Joi.string(),
  latitude: Joi.number().allow("", null),
  longitude: Joi.number().allow("", null),
  emoji: Joi.string(),
  emojiU: Joi.string(),
});

const stateData = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  country_id: Joi.string(),
  country_code: Joi.string(),
  country_name: Joi.string(),
  state_code: Joi.string(),
  type: Joi.any(),
  latitude: Joi.number().allow("", null),
  longitude: Joi.number().allow("", null),
});

const cityData = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  state_id: Joi.string(),
  state_code: Joi.string(),
  state_name: Joi.string(),
  country_id: Joi.string(),
  country_code: Joi.string(),
  country_name: Joi.string(),
  latitude: Joi.number().allow("", null),
  longitude: Joi.number().allow("", null),
  wikiDataId: Joi.string().allow("", null),
});

export default {
  countries: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(countryData),
  }) as any,
  country: Joi.object({
    statusCode: Joi.number(),
    data: countryData,
  }) as any,
  states: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(stateData),
  }) as any,
  state: Joi.object({
    statusCode: Joi.number(),
    data: stateData,
  }) as any,
  cities: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items(cityData),
  }) as any,
  city: Joi.object({
    statusCode: Joi.number(),
    data: cityData,
  }) as any,
  commonList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      id: Joi.string().allow(),
      name: Joi.string(),
      code: Joi.any(),
      group: Joi.any(),
    }),
  }) as any,
  commonPartnersList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      affiliation: Joi.array().items({
        id: Joi.string().allow(),
        name: Joi.string().allow(""),
      }),
      relation: Joi.array().items({
        id: Joi.string().allow(),
        name: Joi.string().allow(""),
      }),
      acquisition: Joi.array().items({
        id: Joi.string().allow(),
        name: Joi.string().allow(""),
      }),
    }),
  }),
  getListRegion: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      count: Joi.number(),
      name: Joi.string(),
      countries: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        phone_code: Joi.string(),
      }),
    }),
  }) as any,
  responseIdIsNumber: Joi.array().items({
    id: Joi.number(),
    name: Joi.string(),
  }),
  dimensionAndWeight: Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    with_diameter: Joi.boolean(),
    attributes: Joi.array().items(
      Joi.object({
        id: Joi.string().allow(null, ""),
        name: Joi.string().allow(null, ""),
        basis_id: Joi.string().allow(null, ""),
        type: Joi.string().allow(null, ""),
        conversion_value_1: Joi.any(),
        conversion_value_2: Joi.any(),
        text: Joi.string().allow(null, ""),
        basis_value_id: Joi.string().allow(null, ""),
        with_diameter: Joi.boolean().allow(null),
        conversion: Joi.object({
          id: Joi.string().allow(null, ""),
          name_1: Joi.string().allow(null, ""),
          name_2: Joi.string().allow(null, ""),
          formula_1: Joi.number(),
          formula_2: Joi.number(),
          unit_1: Joi.string().allow(null, ""),
          unit_2: Joi.string().allow(null, ""),
        }).allow(null),
      }).allow(null)
    ),
  }),
};
