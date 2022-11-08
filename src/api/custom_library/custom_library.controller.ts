import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customLibraryService } from "./custom_library.service";
// import {} from "./custom_library.type";

export default class CustomLibraryController {
  public async create(
    req: Request ,
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await customLibraryService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
