import ContactRepository from "@/repositories/contact.repository";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { IContactRequest } from "./contact.type";
import { mailService } from "@/services/mail.service";

export default class ContactService {
  private contactRepository: ContactRepository;
  constructor() {
    this.contactRepository = new ContactRepository();
  }

  public async create(payload: IContactRequest) {
    const result = await this.contactRepository.create({
      name: payload.name,
      email: payload.email,
      inquiry: payload.inquiry || null,
    });
    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    await mailService.sendContactEmail(payload);
    return successResponse({
      data: result,
    });
  }

  public async getList(limit: number, offset: number, filter: any, sort: any) {
    const contacts = await this.contactRepository.getListContact(
      limit,
      offset,
      filter,
      sort
    );
    if (!contacts) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    return successResponse({
      data: contacts,
    });
  }

  public async getById(id: string) {
    const contact = await this.contactRepository.find(id);
    if (!contact) {
      return errorMessageResponse(MESSAGES.CONTACT_NOT_FOUND, 404);
    }
    return successResponse({
      data: contact,
    });
  }
}

export const contactService = new ContactService();
