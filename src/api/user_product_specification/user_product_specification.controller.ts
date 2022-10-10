import { UserProductSpecificationRequest } from "@/api/user_product_specification/user_product_specification.model";
import { MESSAGES } from "@/constants";
import { errorMessageResponse } from "@/helper/response.helper";
import productRepository from "@/repositories/product.repository";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { userProductSpecificationRepository } from "./user_product_specification.repository";

export default class UserProductSpecificationController {
  public selectSpecification = async (
    req: Request & { payload: UserProductSpecificationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const currentUserId = req.auth.credentials.user_id as string;
    const productId = req.params.id;

    const product = await productRepository.find(req.params.id);

    if (!product) {
      return toolkit
        .response({
          message: "Product not found.",
          status: 400,
        })
        .code(400);
    }

    const response = await userProductSpecificationRepository.upsert(
      productId,
      currentUserId,
      payload
    );

    if (!response) {
      return "failed";
    }

    return toolkit.response("success").code(200);
  };

  public getSelectedSpecification = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const currentUserId = req.auth.credentials.user_id as string;
    const productId = req.params.id;

    const response = await userProductSpecificationRepository.findBy({
      product_id: productId,
      user_id: currentUserId,
    });

    if (!response) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG, 404))
        .code(404);
    }

    return toolkit.response({ data: response }).code(200);
  };
}
