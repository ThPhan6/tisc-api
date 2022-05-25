import * as HapiJoi from "@hapi/joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export default {
  AgreementPoliciesTerms: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      id: Joi.string(),
      logo: Joi.string(),
      type: Joi.number(),
      title: Joi.string(),
      document: Joi.object(),
      created_at: Joi.any(),
      created_by: Joi.string(),
      updated_at: Joi.any(),
    }),
  }) as any,
};
