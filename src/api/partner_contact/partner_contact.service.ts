import { PartnerRequest } from "@/api/partner/partner.type";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { partnerContactRepository } from "@/repositories/partner_contact.repository";
import { SortOrder, UserAttributes } from "@/types";
import {
  PartnerContactFilter,
  PartnerContactRequest,
  PartnerContactResponse,
  PartnerContactSort,
} from "./partner_contact.type";

class PartnerContactService {
  public create = async (payload: PartnerRequest) => {
    const createdContact = await partnerContactRepository.create(payload);

    if (!createdContact)
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);

    return successResponse({
      data: {
        ...createdContact,
      },
    });
  };

  public async getList(
    authenticatedUser: UserAttributes,
    limit: number,
    offset: number,
    filter: PartnerContactFilter = {},
    sort: PartnerContactSort,
    order: SortOrder
  ): Promise<PartnerContactResponse> {
    const { partner_contacts, pagination } =
      await partnerContactRepository.getListPartnerContact(
        limit,
        offset,
        sort,
        order,
        authenticatedUser.relation_id,
        filter
      );

    return {
      data: {
        partner_contacts,
        pagination,
      },
      statusCode: 200,
    };
  }

  public async getOne(id: string) {
    const { data } = await partnerContactRepository.getOne(id);

    if (!data) return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);

    return successResponse({
      data,
    });
  }

  public async update(id: string, payload: PartnerContactRequest) {
    const updatedPartner = await partnerContactRepository.update(id, payload);

    if (!updatedPartner)
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);

    return this.getOne(id);
  }

  public async delete(id: string) {
    const foundPartner = await partnerContactRepository.findAndDelete(id);

    if (!foundPartner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND, 404);

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}

export default new PartnerContactService();
