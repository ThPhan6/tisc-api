import { MESSAGES } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import {
  CustomResourcePayload,
  SummaryInfo,
  UserAttributes,
  UserType,
} from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { v4 } from "uuid";
import { customResourceService } from "./custom_resource.service";
import { customResourceRepository } from "./custom_resource.repository";

export default class CustomResourceController {
  public async createResource(
    req: Request & { payload: CustomResourcePayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;

    const response = await customResourceService.createResource(
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getListResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const { limit, offset, sort, order, type } = req.query;

    const total = await customResourceRepository.getTotalByTypeAndRelation(type, user.relation_id);

    const response = await customResourceRepository.getList(
      limit,
      offset,
      sort,
      order,
      type,
      user.relation_id
    );

    if (!response) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG))
        .code(404);
    }

    return toolkit
      .response(
        successResponse({
          data: {
            resources: response,
            pagination: pagination(limit, offset, total),
          },
        })
      )
      .code(200);
  }

  public async getListDistributorsByCompany(
    req: Request,
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;

    const { brand_id } = req.params;

    const brand = await customResourceRepository.getOne(brand_id);

    if (!brand) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404))
        .code(404);
    }

    const response = await customResourceRepository.getDistributorsByCompany(
      brand_id,
      user.relation_id
    );

    if (!response) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG))
        .code(404);
    }

    return toolkit
      .response(
        successResponse({
          data: response,
        })
      )
      .code(200);
  }

  public async getAllResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const { type } = req.query;

    const response = await customResourceRepository.getAllByType(
      type,
      user.relation_id
    );

    if (!response) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG))
        .code(404);
    }

    return toolkit
      .response(
        successResponse({
          data: response,
        })
      )
      .code(200);
  }

  public getCustomResourceSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;

    const summary = await customResourceRepository.getSummary(user.relation_id);

    if (!summary) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG))
        .code(404);
    }

    const mappingSummary: SummaryInfo[] = [
      {
        id: v4(),
        label: "Companies",
        quantity: summary.companies,
      },
      {
        id: v4(),
        label: "Distributors",
        quantity: summary.distributors,
      },
      {
        id: v4(),
        label: "Contacts",
        quantity: summary.contacts,
      },
    ];

    return toolkit
      .response(
        successResponse({
          data: mappingSummary,
        })
      )
      .code(200);
  };

  public async getOneResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const result = await customResourceRepository.getOne(req.params.id);

    if (!result) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.customResource.notFound))
        .code(404);
    }

    if (
      user.type === UserType.Designer &&
      user.relation_id !== result.design_id
    ) {
      return toolkit
        .response(
          errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_ACCESS)
        )
        .code(404);
    }

    return toolkit.response(successResponse({ data: result })).code(200);
  }

  public async updateResource(
    req: Request & { payload: CustomResourcePayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customResourceService.updateResource(
      req.params.id,
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async deleteResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customResourceService.deleteResource(
      req.params.id,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
