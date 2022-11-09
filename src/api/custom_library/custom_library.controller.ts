import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customLibraryService } from "./custom_library.service";
// import {} from "./custom_library.type";

export default class CustomLibraryController {
  public async createProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.createProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async createCompany(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.createCompany(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async updateProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.updateProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async updateCompany(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.updateCompany(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteProduct(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.deleteProduct(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async deleteCompany(req: Request, toolkit: ResponseToolkit) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.deleteCompany(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
