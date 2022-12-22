import { countWord } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import QuotationRepository from "@/repositories/quotation.repository";
import { successMessageResponse } from "@/helper/response.helper";
import { IQuotationRequest } from "./quotation.type";
import { SortOrder } from "@/types";
import { MESSAGES } from "@/constants";

export default class QuotationService {
  private quotationRepository: QuotationRepository;
  constructor() {
    this.quotationRepository = new QuotationRepository();
  }

  public async create(payload: IQuotationRequest) {
    if (countWord(payload.quotation) > 120) {
      return errorMessageResponse(MESSAGES.QUOTATION_MAX_WORD);
    }
    const createdQuotation = await this.quotationRepository.create({
      author: payload.author,
      identity: payload.identity,
      quotation: payload.quotation,
    });
    if (!createdQuotation) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse({ data: createdQuotation });
  }

  public async getList(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: SortOrder
  ) {
    const quotations =
      await this.quotationRepository.getListQuotationWithPagination(
        limit,
        offset,
        filter,
        sort,
        order
      );
    if (!quotations) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    return successResponse({
      data: {
        quotations: quotations.data,
        pagination: quotations.pagination,
      },
    });
  }

  public async getOne(id: string) {
    const quotation = await this.quotationRepository.find(id);
    if (!quotation) {
      return errorMessageResponse(MESSAGES.QUOTATION_NOT_FOUND, 404);
    }
    return successResponse({
      data: quotation,
    });
  }

  public async update(id: string, payload: IQuotationRequest) {
    const quotation = await this.quotationRepository.findAndUpdate(id, payload);
    if (!quotation[0]) {
      return errorMessageResponse(MESSAGES.QUOTATION_NOT_FOUND);
    }
    return successResponse({
      data: quotation[0],
    });
  }

  public async delete(id: string) {
    const quotation = await this.quotationRepository.findAndDelete(id);
    if (!quotation) {
      return errorMessageResponse(MESSAGES.QUOTATION_NOT_FOUND);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}
export const quotationService = new QuotationService();
