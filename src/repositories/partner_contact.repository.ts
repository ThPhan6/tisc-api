import {
  PartnerContactAttributes,
  PartnerContactSort,
  PartnerContactStatus,
} from "@/api/partner_contact/partner_contact.type";
import { pagination } from "@/helpers/common.helper";
import PartnerContactModel from "@/models/partner_contact.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/types";

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
    FILTER contacts.deleted_at == null
    ${filter.status ? `FILTER tempList.status == @status` : ""}
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
      RETURN MERGE(UNSET(contacts, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
        fullname: CONCAT(contacts.firstname, " ", contacts.lastname),
        company: company.name,
        country: company.country_name
      })
    )
    FOR data IN tempList
    ${filter.status ? `FILTER data.status == @status` : ""}
    ${sort && order ? ` SORT data.${sort} ${order} ` : ""}
    ${limit ? `LIMIT ${offset}, ${limit}` : ""}
    RETURN data
    `;

    let bindData: any = { brandId };
    if (filter.status) {
      bindData = {
        ...bindData,
        status: filter.status,
      };
    }
    let result = await this.model.rawQueryV2(raw, bindData);
    let total = await this.model.rawQueryV2(
      totalRaw,
      filter.status ? { status: filter.status } : {}
    );
    if (!result) {
      result = [];
    }
    return {
      partner_contacts: result,
      pagination: pagination(limit, offset, total[0]),
    };
  };

  // public getOnePartnerCompany = async (id: string, brandId: string) => {
  //   let query = this.model
  //     .getQuery()
  //     .select([
  //       "name",
  //       "website",
  //       "country_id",
  //       "country_name",
  //       "state_id",
  //       "state_name",
  //       "city_id",
  //       "city_name",
  //       "address",
  //       "postal_code",
  //       "phone",
  //       "phone_code",
  //       "email",
  //       "affiliation_id",
  //       "affiliation_name",
  //       "relation_id",
  //       "relation_name",
  //       "acquisition_id",
  //       "acquisition_name",
  //       "price_rate",
  //       "authorized_country_ids",
  //       "authorized_country_name",
  //       "coverage_beyond",
  //       "remark",
  //       "location_id",
  //     ])
  //     .where("brand_id", "==", brandId)
  //     .where("id", "==", id);

  //   const result = await query.first();

  //   return {
  //     partner: result as PartnerContactAttributes,
  //   };
  // };
}

export default new PartnerContactRepository();
export const partnerContactRepository = new PartnerContactRepository();
