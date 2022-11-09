import { MESSAGES } from "@/constants";
import {
  // errorMessageResponse,
  successMessageResponse,
  // successResponse,
} from "@/helper/response.helper";
// import { customLibraryRepository } from "@/repositories/custom_library.repository";
import { UserAttributes } from "@/types";


class CustomLibraryService {
  public createProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public createCompany = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public updateProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public updateCompany = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public deleteProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
  public deleteCompany = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}
export const customLibraryService = new CustomLibraryService();
export default CustomLibraryService;
