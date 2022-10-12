import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { generalInquiryService } from "./general_inquiry.service";
import { GeneralInquiryRequest } from "./general_inquiry.type";

export default class GeneralInquiryController {
  public async create(
    req: Request & { payload: GeneralInquiryRequest },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;

    const user = req.auth.credentials.user as UserAttributes;

    const response = await generalInquiryService.create(user, payload);

    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getList(req: Request, toolkit: ResponseToolkit) {
    const { limit, offset, sort, filter } = req.query;

    const user = req.auth.credentials.user as UserAttributes;

    const response = await generalInquiryService.getList(
      user.relation_id,
      limit,
      offset,
      sort,
      filter
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getSummary(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;

    const response = await generalInquiryService.getSummary(user.relation_id);

    return toolkit.response(response).code(200);
  }

  public async getOne(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;

    const user = req.auth.credentials.user as UserAttributes;

    const response = await generalInquiryService.getOne(id, user);

    return toolkit.response(response).code(200);
  }
}
