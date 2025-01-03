import { getEnumValues } from "@/helpers/common.helper";
import { paginationResponse } from "@/helpers/response.helper";
import {
  EProjectTrackingType,
  ProjectTrackingEntity,
  ProjectTrackingPriority,
} from "@/types";
import { getSummaryResponseValidate } from "@/validates/common.response";
import * as HapiJoi from "joi";

const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

const designerValidate = Joi.object({
  location_id: Joi.string().allow(""),
  firstname: Joi.string().allow(""),
  lastname: Joi.string().allow(""),
  position: Joi.string().allow(""),
  email: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  phone_code: Joi.string().allow(""),
}).allow(null);
const productValidate = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  description: Joi.string().allow(""),
  images: Joi.array().items(Joi.string()),
  collection_name: Joi.string(),
});

const getBrandProjectResponse = {
  id: Joi.string().required(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  project_name: Joi.string().required(),
  brand_id: Joi.string().required(),
  location_id: Joi.string().required(),
  project_code: Joi.string().allow(null).allow(""),
  city_id: Joi.string().allow(null).allow(""),
  state_id: Joi.string().allow(null).allow(""),
  address: Joi.string().allow(null).allow(""),
  project_type: Joi.string().allow(null).allow(""),
  building_type: Joi.string().allow(null).allow(""),
  date_of_tender: Joi.string().allow(null).allow(""),
  date_of_delivery: Joi.string().allow(null).allow(""),
  design_firm: Joi.string().allow(null).allow(""),
  postal_code: Joi.string().allow(null).allow(""),
  partner_id: Joi.string().allow(null).allow(""),
  note: Joi.string().allow(null).allow(""),
  project_stage_id: Joi.string().allow(null).allow(""),
  priority: Joi.number()
    .allow(null)
    .valid(...getEnumValues(ProjectTrackingPriority)),
  type: Joi.number()
    .required()
    .valid(...getEnumValues(EProjectTrackingType)),
};

const getDesignerProjectResponse = {
  projects: Joi.object({
    id: Joi.string(),
    created_at: Joi.string(),
    name: Joi.string(),
    location: Joi.string(),
    project_type: Joi.string(),
    building_type: Joi.string(),
    measurement_unit: Joi.number(),
    design_due: Joi.string(),
    construction_start: Joi.string(),
  }),
  projectRequests: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      created_at: Joi.string(),
      title: Joi.string(),
      message: Joi.string(),
      status: Joi.number(),
      created_by: Joi.string(),
      product: productValidate,
      newRequest: Joi.bool(),
      requestFor: Joi.string(),
      designer: designerValidate,
    })
  ),
  notifications: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      created_at: Joi.string(),
      type: Joi.number(),
      status: Joi.number(),
      created_by: Joi.string(),
      projectProductId: Joi.any(),
      product: productValidate,
      newNotification: Joi.bool(),
      designer: designerValidate,
    })
  ),
  designFirm: Joi.object({
    name: Joi.string(),
    official_website: Joi.string().allow(""),
    locations: Joi.array().items(
      Joi.object({
        address: Joi.string().allow(""),
        city_name: Joi.string().allow(""),
        country_name: Joi.string().allow(""),
        general_email: Joi.string().allow(""),
        general_phone: Joi.string().allow(""),
        phone_code: Joi.string().allow(""),
        teamMembers: Joi.array().items(
          Joi.object({
            firstname: Joi.string().allow(""),
            lastname: Joi.string().allow(""),
            position: Joi.string().allow(""),
          })
        ),
      })
    ),
  }).allow(null),
};

const getCreateProjectTrackingSchema = (
  value: ProjectTrackingEntity,
  _helpers: HapiJoi.CustomHelpers
) => {
  switch (value.type) {
    case EProjectTrackingType.BRAND:
      return Joi.object(getBrandProjectResponse).unknown(false);

    case EProjectTrackingType.DESIGNER:
      return Joi.object(getBrandProjectResponse).unknown(false);

    default:
      return Joi.object(getDesignerProjectResponse);
  }
};

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
    message: Joi.string().allow(""),
  }) as any,
  getBrandProject: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object(getBrandProjectResponse).unknown(false),
    message: Joi.string().allow(""),
  }),
  getListProjectTracking: Joi.object({
    data: Joi.object({
      pagination: paginationResponse,
      projectTrackings: Joi.array().items({
        id: Joi.string(),
        created_at: Joi.string(),
        projectName: Joi.string(),
        projectLocation: Joi.string(),
        projectType: Joi.string(),
        designFirm: Joi.string(),
        projectStatus: Joi.string(),
        priority: Joi.number(),
        priorityName: Joi.string(),
        assignedTeams: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            firstname: Joi.string(),
            lastname: Joi.string(),
            avatar: Joi.string().allow(null, ""),
          })
        ),
        requestCount: Joi.number(),
        newRequest: Joi.bool(),
        notificationCount: Joi.number(),
        newNotification: Joi.bool(),
        newTracking: Joi.bool(),

        /// brand
        partner_id: Joi.string(),
        project_stage_id: Joi.string(),
        project_id: Joi.string(),
        brand_id: Joi.string(),
        project_code: Joi.string(),
        project_name: Joi.string(),
        location_id: Joi.string(),
        state_id: Joi.string(),
        city_id: Joi.string(),
        address: Joi.string(),
        postal_code: Joi.string(),
        project_type: Joi.string(),
        building_type: Joi.string(),
        date_of_tender: Joi.string(),
        date_of_delivery: Joi.string(),
        note: Joi.string(),
        design_firm: Joi.string(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getProjectTrackingSummary: getSummaryResponseValidate(),
  get: Joi.object({
    statusCode: Joi.number(),
    message: Joi.string(),
    data: Joi.custom((value, helpers) => {
      const schema = getCreateProjectTrackingSchema(value, helpers);
      const { error } = schema.validate(value);

      if (error) {
        const firstError = error.details[0];
        return helpers.message({
          custom: firstError.message,
        });
      }

      return value;
    }),
  }),
};
