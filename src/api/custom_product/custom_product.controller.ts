import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { CustomProductPayload, UserAttributes, UserType } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customProductService } from "./custom_product.service";
import { customProductRepository } from "./custom_product.repository";
import { mappingDimensionAndWeight } from "@/api/attribute/attribute.mapping";

export default class CustomProductController {
  public async createProduct(
    req: Request & { payload: CustomProductPayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.createProduct(
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getListProduct(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const { company_id, collection_id, limit, offset } = req.query;
    const results = await customProductRepository.getList(
      user.relation_id,
      company_id,
      collection_id, limit, offset
    );

    return toolkit
      .response(
        successResponse({
          data: {
            products: results,
          },
        })
      )
      .code(200);
  }

  public async getOneProduct(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const result = await customProductRepository.getOne(req.params.id, user.id);

    if (!result) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND))
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

    result.dimension_and_weight = mappingDimensionAndWeight(
      result.dimension_and_weight
    );

    return toolkit.response(successResponse({ data: result })).code(200);
  }

  public duplicateProduct = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.duplicate(id, user);

    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public async updateProduct(
    req: Request & { payload: CustomProductPayload },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.updateProduct(
      req.params.id,
      req.payload,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async deleteProduct(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.deleteProduct(
      req.params.id,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
