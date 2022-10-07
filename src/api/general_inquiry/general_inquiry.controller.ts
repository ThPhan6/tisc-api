import { settingService } from "./../setting/setting.service";
import { generalInquiryService } from "./general_inquiry.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { GeneralInquiryRequest } from "./general_inquiry.type";
import { UserAttributes } from "@/types";

export default class GeneralInquiryController {
  public async create(
    req: Request & { payload: GeneralInquiryRequest },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await generalInquiryService.create(user.id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
