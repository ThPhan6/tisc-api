import { getEnumValues } from "@/helper/common.helper";
import { paginationResponse } from "@/helper/response.helper";
import { ProjectStatus } from "@/types";
import { getSummaryResponseValidate } from "@/validate/common.response";
import * as HapiJoi from "joi";
import { areaResponse } from "../project_zone/project_zone.response";

const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

const brandResponse = Joi.array().items(
  Joi.object({
    name: Joi.string(),
    logo: Joi.string(),
    products: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        brand_id: Joi.string(),
        name: Joi.string(),
        image: Joi.string(),
        status: Joi.number(),
      })
    ),
  })
);

export default {
  getOne: Joi.object({
    data: Joi.any(),
    statusCode: Joi.number(),
  }),
  getAll: Joi.object({
    data: Joi.array().items({
      id: Joi.string(),
      code: Joi.string(),
      name: Joi.string(),
    }),
    statusCode: Joi.number(),
  }),
  getList: Joi.object({
    data: Joi.object({
      pagination: paginationResponse,
      projects: Joi.array().items({
        id: Joi.string(),
        code: Joi.string(),
        name: Joi.string(),
        location: Joi.any(),
        project_type: Joi.string(),
        building_type: Joi.string(),
        created_at: Joi.string(),
        design_due: Joi.string(),
        design_id: Joi.string(),
        status: Joi.number().valid(...getEnumValues(ProjectStatus)),
        assign_teams: Joi.array().items({
          id: Joi.string(),
          firstname: Joi.string(),
          lastname: Joi.string(),
          avatar: Joi.any(),
        }),
      }),
    }),
    statusCode: Joi.number(),
  }),
  getlistType: Joi.object({
    statusCode: Joi.number(),
    data: Joi.array().items({
      id: Joi.string(),
      name: Joi.string(),
    }),
  }),
  getSummary: Joi.object({
    projects: Joi.number(),
    live: Joi.number(),
    on_hold: Joi.number(),
    archived: Joi.number(),
  }),
  getProjectGroupByStatus: {
    data: Joi.array().items(
      Joi.object({
        status_name: Joi.string(),
        count: Joi.number(),
        projects: Joi.array().items(
          Joi.object({
            code: Joi.string(),
            name: Joi.string(),
            location: Joi.string().allow(""),
            building_type: Joi.string(),
            type: Joi.string(),
            measurement_unit: Joi.number(),
            design_due: Joi.string(),
            construction_start: Joi.string(),
          })
        ),
      })
    ),
    statusCode: Joi.number(),
  },
  getSummaryOverall: getSummaryResponseValidate({
    area: Joi.object({
      metric: Joi.number(),
      imperial: Joi.number(),
    }),
  }),
  getProjectListing: Joi.object({
    data: Joi.object({
      pagination: paginationResponse,
      projects: Joi.array().items(
        Joi.object({
          created_at: Joi.string(),
          id: Joi.string(),
          name: Joi.string(),
          status: Joi.string(),
          project_type: Joi.string(),
          building_type: Joi.string(),
          country_name: Joi.string(),
          city_name: Joi.string(),
          design_due: Joi.string(),
          design_id: Joi.string(),
          metricArea: Joi.number(),
          imperialArea: Joi.number(),
          productCount: Joi.number(),
          deleted: Joi.number(),
          consider: Joi.number(),
          unlisted: Joi.number(),
          specified: Joi.number(),
          cancelled: Joi.number(),
        })
      ),
    }),
    statusCode: Joi.number(),
  }),
  getProjectListingDetail: Joi.object({
    data: Joi.object({
      basic: Joi.object({
        designFirm: Joi.object({
          name: Joi.string(),
          logo: Joi.string(),
        }),
        code: Joi.string(),
        name: Joi.string(),
        status: Joi.number(),
        address: Joi.string(),
        project_type: Joi.string(),
        building_type: Joi.string(),
        measurement_unit: Joi.number(),
        design_due: Joi.string(),
        construction_start: Joi.string(),
        updated_at: Joi.string(),
      }),
      spacing: Joi.object({
        imperialArea: Joi.number(),
        metricArea: Joi.number(),
        zones: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            areas: Joi.array().items(areaResponse),
          })
        ),
      }),
      considered: Joi.object({
        brands: brandResponse,
        deleted: Joi.number(),
        consider: Joi.number(),
        unlisted: Joi.number(),
      }),
      specified: Joi.object({
        brands: brandResponse,
        deleted: Joi.number(),
        specified: Joi.number(),
        cancelled: Joi.number(),
      }),
      members: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          firstname: Joi.string().allow(""),
          lastname: Joi.string().allow(""),
          avatar: Joi.string().allow(null),
          gender: Joi.boolean(),
          position: Joi.string().allow(""),
          email: Joi.string().allow(""),
          phone: Joi.string().allow(""),
          mobile: Joi.string().allow(""),
          status: Joi.number(),
          department: Joi.string().allow(""),
          phone_code: Joi.string().allow(""),
          access_level: Joi.string().allow(""),
          work_location: Joi.string().allow(""),
        })
      ),
    }),
    statusCode: Joi.number(),
  }),
};
