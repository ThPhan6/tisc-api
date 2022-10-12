import { COMMON_TYPES, MESSAGES } from "@/constants";
import { GENERAL_INQUIRY_STATUS } from "@/constants/general_inquiry.constant";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import productRepository from "@/repositories/product.repository";
import { SortValidGeneralInquiry, UserAttributes } from "@/types";
import { head, uniq } from "lodash";
import { settingService } from "./../setting/setting.service";
import { mappingGeneralInquiries } from "./general_inquiry.mapping";
import { GeneralInquiryRequest } from "./general_inquiry.type";
class GeneralInquiryService {
  public async create(user: UserAttributes, payload: GeneralInquiryRequest) {
    const product = await productRepository.find(payload.product_id);

    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, 404);
    }

    payload.inquiry_for_ids = await settingService.findOrCreateList(
      payload.inquiry_for_ids,
      user.relation_id,
      COMMON_TYPES.REQUEST_FOR
    );

    const createdGeneralInquiry = await generalInquiryRepository.create({
      product_id: product.id,
      title: payload.title,
      message: payload.message,
      inquiry_for_ids: payload.inquiry_for_ids,
      status: GENERAL_INQUIRY_STATUS.PENDING,
      read: [],
      created_by: user.id,
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
    sort: SortValidGeneralInquiry,
    filter: any
  ) {
    const generalInquiries =
      await generalInquiryRepository.getListGeneralInquiry(
        relationId,
        limit,
        offset,
        sort,
        {
          ...filter,
          status: filter?.status,
        }
      );

    const allInquiry = await generalInquiryRepository.getAllInquiryBy(
      relationId,
      { ...filter, status: filter?.status }
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
    const userReadNotificationIds = uniq([...inquiry.read, user.id]);

    //update user read notification
    await generalInquiryRepository.update(id, {
      read: userReadNotificationIds,
    });

    const result = await generalInquiryRepository.getDetailGeneralInquiry(id);
    return successResponse({ data: head(result) || null });
  }
}
export const generalInquiryService = new GeneralInquiryService();
export default GeneralInquiryService;
