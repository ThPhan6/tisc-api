import {
  PartnerContactAttributes,
  PartnerContactSort,
} from "@/api/partner_contact/partner_contact.type";
import { DEFAULT_UNEMPLOYED_COMPANY_NAME } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import PartnerContactModel from "@/models/partner_contact.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder, UserStatus, UserType } from "@/types";

const isValidPartnerContactStatus = (status: any) => {
  switch (status) {
    case UserStatus.Uninitiate:
      return true;
    case UserStatus.Active:
      return true;
    case UserStatus.Pending:
      return true;
    default:
      return false;
  }
};
class PartnerContactRepository extends BaseRepository<PartnerContactAttributes> {
  constructor() {
    super();
    this.model = new PartnerContactModel();
  }
  protected model: PartnerContactModel;
  protected DEFAULT_ATTRIBUTE: Partial<PartnerContactAttributes> = {
    relation_id: "",
    firstname: "",
    lastname: "",
    gender: true,
    linkedin: "",
    position: "",
    email: "",
    phone: "",
    mobile: "",
    remark: "",
    status: UserStatus.Uninitiate,
  };

  public getListPartnerContact = async (
    limit: number,
    offset: number,
    sort: PartnerContactSort,
    order: SortOrder,
    brandId: string | null,
    filter: {
      status?: UserStatus;
    } = {}
  ) => {
    let totalRaw = `
    FOR contact IN users
    FILTER contact.deleted_at == null
    FILTER contact.type == ${UserType.Partner}
    LET company = FIRST(
      FOR partner IN partners
      FILTER partner.deleted_at == null
      FILTER partner.brand_id == @brandId
      FILTER partner.id == contact.relation_id
      RETURN partner
    )
    FILTER company.brand_id == @brandId
    OR contact.relation_id == @brandId
    ${
      isValidPartnerContactStatus(filter.status)
        ? `FILTER contact.status == @status`
        : ""
    }
    COLLECT WITH COUNT INTO length RETURN length
    `;
    let raw = `
    LET tempList = (
      FOR contact IN users
      FILTER contact.deleted_at == null
      FILTER contact.type == ${UserType.Partner}
      LET company = FIRST(
        FOR partner IN partners
        FILTER partner.deleted_at == null
        FILTER partner.brand_id == @brandId
        FILTER partner.id == contact.relation_id
        RETURN partner
      )
      FILTER company.brand_id == @brandId
      OR contact.relation_id == @brandId

      RETURN MERGE(UNSET(contact, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
        fullname: CONCAT(contact.firstname, " ", contact.lastname),
        company_name: company.name != null ? company.name : ${DEFAULT_UNEMPLOYED_COMPANY_NAME},
        country_name: company.country_name
      })
    )
    FOR data IN tempList
    ${
      isValidPartnerContactStatus(filter.status)
        ? `FILTER data.status == @status`
        : ""
    }
    ${sort && order ? ` SORT data.${sort} ${order} ` : ""}
    ${limit ? `LIMIT ${offset}, ${limit}` : ""}
    RETURN data
    `;

    let bindData: any = { brandId };
    if (isValidPartnerContactStatus(filter.status)) {
      bindData = {
        ...bindData,
        status: filter.status,
      };
    }
    let result = await this.model.rawQueryV2(raw, bindData);
    let total = await this.model.rawQueryV2(
      totalRaw,
      isValidPartnerContactStatus(filter.status)
        ? { status: filter.status, brandId }
        : { brandId }
    );
    if (!result) {
      result = [];
    }
    return {
      partner_contacts: result,
      pagination: pagination(limit, offset, total[0]),
    };
  };

  public getOne = async (id: string) => {
    let raw = `
    LET temp = FIRST(
      FOR contact IN users
      LET company = FIRST(
        FOR partner IN partners
        FILTER partner.deleted_at == null
        FILTER partner.id == contact.relation_id
        RETURN partner
      )
      FILTER contact.id == @id
      FILTER contact.deleted_at == null
      RETURN MERGE(UNSET(contact, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
        fullname: CONCAT(contact.firstname, " ", contact.lastname),
        company_name: company.name != null ? company.name : ${DEFAULT_UNEMPLOYED_COMPANY_NAME},
        country_name: company.country_name,
        phone_code: company.phone_code != null ?  company.phone_code : '00'
      })
    )
    RETURN temp
      `;

    const result = await this.model.rawQueryV2(raw, { id });

    return {
      data: result[0] as PartnerContactAttributes,
    };
  };

  public async updateContactToUnemployed(partnerId: string, brandId: string) {
    await this.model
      .getQuery()
      .where("relation_id", "==", partnerId)
      .whereNull("deleted_at")
      .update({
        relation_id: brandId,
        company_name: DEFAULT_UNEMPLOYED_COMPANY_NAME,
      });
  }
}

export default new PartnerContactRepository();
export const partnerContactRepository = new PartnerContactRepository();
