import { SortOrder } from "@/types";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import productRepository from "@/repositories/product.repository";
import { GeneralInquiryRequest } from "./general_inquiry.type";
import { GENERAL_INQUIRY_STATUS } from "@/constants/general_inquiry.constant";
class GeneralInquiryService {
  public async create(userId: string, payload: GeneralInquiryRequest) {
    const product = await productRepository.find(payload.product_id);

    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, 404);
    }

    //validate general inquiry duplicate
    //check trùng product_id & created_by & title==> khong dc tao
    //trùng product_id & created_by khac title==>  dc tao

    const createdGeneralInquiry = await generalInquiryRepository.create({
      product_id: product.id,
      title: payload.title,
      message: payload.message,
      inquiry_for_ids: payload.inquiry_for_ids,
      status: GENERAL_INQUIRY_STATUS.PENDING,
      read: [],
      created_by: userId,
    });

    if (!createdGeneralInquiry) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    return successResponse({
      data: createdGeneralInquiry,
    });
  }

  public async getList(
    relationId: string,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder,
    filter: any
  ) {
    const inquiries = await generalInquiryRepository.getListGeneralInquiry(
      relationId,
      limit,
      offset,
      sort,
      order
    );
    console.log(inquiries, "[inquiries]");
    return successMessageResponse("");
  }
}
export const generalInquiryService = new GeneralInquiryService();
export default GeneralInquiryService;
