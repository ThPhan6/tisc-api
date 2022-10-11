import { paginationResponse } from "@/helper/response.helper";
import * as HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) => schema.options({ abortEarly: false }));

export default {
  getOne: Joi.object({
    statusCode: Joi.number(),
    data: Joi.any(),
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
};
