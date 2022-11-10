import { MESSAGES } from "@/constants";
import { successMessageResponse } from "@/helper/response.helper";
import { UserAttributes } from "@/types";

class CustomProductService {
  public getListProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public createProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public updateProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public deleteProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };

  public createResource = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public getListResource = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public updateResource = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public deleteResource = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
}
export const customProductService = new CustomProductService();
export default CustomProductService;
