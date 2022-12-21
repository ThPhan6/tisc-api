import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export const TemplateData = Joi.object({
  id: Joi.string(),
  name: Joi.string().allow(''),
  preview_url: Joi.string().allow(''),
  pdf_url: Joi.string().allow(''),
  sequence: Joi.number(),
  group: Joi.number(),
  created_at: Joi.string().allow(null),
  updated_at: Joi.string().allow(null),
});
export const SpecifyPDFConfig = Joi.object({
  id: Joi.string(),
  project_id: Joi.string(),
  location_id: Joi.string().allow(''),
  issuing_for_id: Joi.string().allow(''),
  issuing_date: Joi.string().allow(''),
  revision: Joi.string().allow(''),
  has_cover: Joi.boolean(),
  document_title: Joi.string().allow(''),
  template_ids: Joi.array().items(Joi.string()),
  created_at: Joi.string().allow(null),
  updated_at: Joi.string().allow(null),
  created_by: Joi.string().allow(null),
  updated_by: Joi.string().allow(null),
});

export default {
  getSpecifyPDFConfig: Joi.object({
    data: Joi.object({
      config: SpecifyPDFConfig,
      templates: Joi.object({
        cover: Joi.array().items(Joi.object({
          name: Joi.string(),
          items: Joi.array().items(TemplateData)
        })),
        specification: Joi.array().items(Joi.object({
          name: Joi.string(),
          items: Joi.array().items(TemplateData)
        })),
      })
    }),
    statusCode: Joi.number(),
  }) as any,
}
