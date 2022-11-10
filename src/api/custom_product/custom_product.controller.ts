import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customProductService } from "./custom_product.service";

export default class CustomProductController {
  public async createProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.createProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async createResource(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.createResource(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async updateProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.updateProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async updateResource(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.updateResource(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.deleteProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteResource(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.deleteResource(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async getListProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.getListProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async getListResource(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customProductService.getListResource(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
