import {
  PartnerContactAttributes,
  PartnerContactSort,
  PartnerContactStatus,
} from "@/api/partner_contact/partner_contact.type";
import { pagination } from "@/helpers/common.helper";
import PartnerContactModel from "@/models/partner_contact.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/types";

const isValidPartnerContactStatus = (status: any) => {
  switch (status) {
    case PartnerContactStatus.Uninitiate:
      return true;
    case PartnerContactStatus.Activated:
      return true;
    case PartnerContactStatus.Pending:
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
    partner_company_id: "",
    firstname: "",
    lastname: "",
    gender: true,
    linkedin: "",
    position: "",
    email: "",
    phone: "",
    mobile: "",
    remark: "",
    status: PartnerContactStatus.Uninitiate,
  };

  public getListPartnerContact = async (
    limit: number,
    offset: number,
    sort: PartnerContactSort,
    order: SortOrder,
    brandId: string | null,
    filter: {
      status?: PartnerContactStatus;
    } = {}
  ) => {
    let totalRaw = `
    FOR contacts IN partner_contacts
    LET company = FIRST(
        FOR partners IN partners 
        FILTER partners.brand_id == @brandId
        FILTER partners.id == contacts.partner_company_id
        RETURN partners
      )
    FILTER contacts.deleted_at == null
    FILTER company.brand_id == @brandId
    ${
      isValidPartnerContactStatus(filter.status)
        ? `FILTER contacts.status == @status`
        : ""
    }
    COLLECT WITH COUNT INTO length RETURN length
    `;
    let raw = `
    LET tempList = (
      FOR contacts IN partner_contacts
      LET company = FIRST(
        FOR partners IN partners 
        FILTER partners.brand_id == @brandId
        FILTER partners.id == contacts.partner_company_id
        RETURN partners
      )
      FILTER contacts.deleted_at == null
      FILTER company.brand_id == @brandId

      RETURN MERGE(UNSET(contacts, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
        fullname: CONCAT(contacts.firstname, " ", contacts.lastname),
        company_name: company.name,
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
    LET temp = FIRST(FOR contacts IN partner_contacts
      
      LET company = FIRST(
        FOR partners IN partners 
        FILTER partners.id == contacts.partner_company_id
        RETURN partners
      )
      FILTER contacts.id == @id
      FILTER contacts.deleted_at == null
      RETURN MERGE(UNSET(contacts, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
        fullname: CONCAT(contacts.firstname, " ", contacts.lastname),
        company_name: company.name,
        country_name: company.country_name,
        phone_code: company.phone_code
      }))
    RETURN temp  
      `;

    let result = await this.model.rawQueryV2(raw, { id });

    return {
      data: result[0] as PartnerContactAttributes,
    };
  };
}

export default new PartnerContactRepository();
export const partnerContactRepository = new PartnerContactRepository();
