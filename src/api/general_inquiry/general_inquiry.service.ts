import { COMMON_TYPES, MESSAGES } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import productRepository from "@/repositories/product.repository";
import { ActivityTypes, logService } from "@/services/log.service";
import {
  RespondedOrPendingStatus,
  SortOrder,
  SortValidGeneralInquiry,
  UserAttributes,
} from "@/types";
import { head, uniq } from "lodash";
import { settingService } from "./../setting/setting.service";
import { GeneralInquiryRequest } from "./general_inquiry.type";
class GeneralInquiryService {
  public async create(
    user: UserAttributes,
    payload: GeneralInquiryRequest,
    path: string
  ) {
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
      status: RespondedOrPendingStatus.Pending,
      read_by: [],
      created_by: user.id,
    });

    if (!createdGeneralInquiry) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    logService.create(ActivityTypes.create_inquiry_request, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { product_id: product.id },
    });
    return successResponse({
      data: createdGeneralInquiry,
    });
  }

  public async getList(
    userId: string,
    relationId: string,
    limit: number,
    offset: number,
    sort: SortValidGeneralInquiry,
    order: SortOrder,
    filter: any
  ) {
    const generalInquiries =
      await generalInquiryRepository.getListGeneralInquiry(
        userId,
        relationId,
        limit,
        offset,
        filter,
        sort,
        order
      );
    const total = await generalInquiryRepository.countAllInquiryBy(
      relationId,
      filter
    );
    return successResponse({
      data: {
        general_inquiries: generalInquiries,
        pagination: pagination(limit, offset, total),
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
        (inquiry) => inquiry.status === RespondedOrPendingStatus.Pending
      ).length,
      responded: allInquiry.filter(
        (inquiry) => inquiry.status === RespondedOrPendingStatus.Responded
      ).length,
    };
  }

  public async getOne(id: string, user: UserAttributes) {
    const inquiry = await generalInquiryRepository.find(id);

    if (!inquiry) {
      return errorMessageResponse(MESSAGES.GENERAL_INQUIRY.NOT_FOUND, 404);
    }
    const userReadNotificationIds = uniq([...inquiry.read_by, user.id]);

    //update user read_by notification
    await generalInquiryRepository.update(id, {
      read_by: userReadNotificationIds,
    });

    const result = await generalInquiryRepository.getDetailGeneralInquiry(id);

    return successResponse({ data: head(result) || null });
  }
}
export const generalInquiryService = new GeneralInquiryService();
export default GeneralInquiryService;
