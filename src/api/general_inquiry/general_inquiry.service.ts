import { UserAttributes } from "@/types";
import { MESSAGES } from "@/constants";
import { GENERAL_INQUIRY_STATUS } from "@/constants/general_inquiry.constant";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import productRepository from "@/repositories/product.repository";
import { mappingGeneralInquiries } from "./general_inquiry.mapping";
import { GeneralInquiryRequest } from "./general_inquiry.type";
import { uniq } from "lodash";
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
      inquiry_for_id: payload.inquiry_for_id,
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
    sort: any,
    status: number
  ) {
    const generalInquiries =
      await generalInquiryRepository.getListGeneralInquiry(
        relationId,
        limit,
        offset,
        sort,
        status
      );

    const allInquiry = await generalInquiryRepository.getAllInquiryBy(
      relationId
    );

    const result = mappingGeneralInquiries(generalInquiries);

    return successResponse({
      data: {
        general_inquiries: result,
        pagination: pagination(limit, offset, allInquiry.length),
      },
    });
  }

  public async getSummary(relationId: string) {
    const allInquiry = await generalInquiryRepository.getAllInquiryBy(
      relationId
    );

    return {
      inquires: allInquiry.length,

      pending: allInquiry.filter(
        (inquiry) => inquiry.status === GENERAL_INQUIRY_STATUS.PENDING
      ).length,

      responded: allInquiry.filter(
        (inquiry) => inquiry.status === GENERAL_INQUIRY_STATUS.RESPONDED
      ).length,
    };
  }

  public async getOne(id: string, user: UserAttributes) {
    const inquiry = await generalInquiryRepository.find(id);

    if (!inquiry) {
      return errorMessageResponse(MESSAGES.GENERAL_INQUIRY.NOT_FOUND, 404);
    }
    const userReadIds = uniq([...inquiry.read, user.id]);
    console.log(userReadIds, "[userReadIds]");
    const updatedUserRead = await generalInquiryRepository.update(id, {
      read: userReadIds,
    });
    return errorMessageResponse("");
  }
}
export const generalInquiryService = new GeneralInquiryService();
export default GeneralInquiryService;
