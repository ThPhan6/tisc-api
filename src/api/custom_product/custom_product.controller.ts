import { MESSAGES } from "@/constants";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import {
  CustomResourcePayload,
  SummaryInfo,
  UserAttributes,
  UserType,
} from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { v4 } from "uuid";
import { customProductService } from "./custom_product.service";
import { customResourceRepository } from "./custom_resources.repository";

export default class CustomProductController {
  public async createResource(
    req: Request & { payload: CustomResourcePayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;

    const response = await customProductService.createResource(
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getListResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const { limit, offset, sort, order, type } = req.query;

    const total = await customResourceRepository.getTotalByType(type);

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

    if (
      user.type === UserType.Designer &&
      user.relation_id !== result.design_id
    ) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.JUST_OWNER_CAN_GET))
        .code(404);
    }

    if (!result) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.customResource.notFound))
        .code(404);
    }

    return toolkit.response(successResponse({ data: result })).code(200);
  }

  public async updateResource(
    req: Request & { payload: CustomResourcePayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.updateResource(
      req.params.id,
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteResource(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.deleteResource(
      req.params.id,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async createProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.createProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async getListProduct(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const { limit, offset, sort, order, type } = req.query;

    const total = await customResourceRepository.getTotalByType(type);

    const response = await customResourceRepository.getList(
      limit,
      offset,
      sort,
      order,
      type,
      user.relation_id
    );

    return toolkit
      .response(
        successResponse({
          data: {
            resources: response,
            pagigation: pagination(limit, offset, total),
          },
        })
      )
      .code(200);
  }

  public async updateProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.updateProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.deleteProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
