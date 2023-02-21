import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import AutoEmailRepository from "@/repositories/auto_email.repository";
import { SortOrder } from "@/types";
import { mappingAutoEmails } from "./auto_email.mapping";
import { IUpdateAutoEmailRequest } from "./auto_email.type";

export default class AutoEmailService {
  private autoEmailRepository: AutoEmailRepository;
  constructor() {
    this.autoEmailRepository = new AutoEmailRepository();
  }

  public async update(id: string, payload: IUpdateAutoEmailRequest) {
    const foundAutoEmail = await this.autoEmailRepository.find(id);
    if (!foundAutoEmail) {
      return errorMessageResponse(MESSAGES.AUTO_EMAIL_NOT_FOUND, 404);
    }
    const updatedAutoEmail = await this.autoEmailRepository.update(id, payload);
    if (!updatedAutoEmail) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return successResponse({
      data: updatedAutoEmail,
    });
  }

  public async getList(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: SortOrder
  ) {
    const autoEmails =
      await this.autoEmailRepository.getListAutoEmailWithPagination(
        limit,
        offset,
        filter,
        sort,
        order
      );
    if (!autoEmails) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const result = mappingAutoEmails(autoEmails.data);
    return successResponse({
      data: {
        auto_emails: result,
        pagination: autoEmails.pagination,
      },
    });
  }

  public async getOne(id: string) {
    const autoEmail = await this.autoEmailRepository.find(id);
    if (!autoEmail) {
      return errorMessageResponse(MESSAGES.AUTO_EMAIL_NOT_FOUND, 404);
    }
    return successResponse({
      data: autoEmail,
    });
  }
}
export const autoEmailService = new AutoEmailService();
