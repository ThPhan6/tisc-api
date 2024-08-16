import partnerService from "@/api/partner/partner.service";
import { PartnerAttributes } from "@/types/partner.type";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class PartnerController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload;
    const response = await partnerService.create(payload as PartnerAttributes);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
