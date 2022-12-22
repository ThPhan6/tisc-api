import { paginationResponse } from "@/helper/response.helper";
import { getSummaryResponseValidate } from "@/validate/common.response";
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

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
    message: Joi.string().allow(""),
  }) as any,
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
            avatar: Joi.string().allow(null),
          })
        ),
        requestCount: Joi.number(),
        newRequest: Joi.bool(),
        notificationCount: Joi.number(),
        newNotification: Joi.bool(),
        newTracking: Joi.bool(),
      }),
    }),
    statusCode: Joi.number(),
  }) as any,
  getProjectTrackingSummary: getSummaryResponseValidate(),
  getProjectTrackingDetail: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      projects: Joi.object({
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
    }),
  }) as any,
};
