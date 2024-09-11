import PartnerModel from "@/models/partner.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/types";
import { PartnerAttributes } from "@/types/partner.type";

class PartnerRepository extends BaseRepository<PartnerAttributes> {
  constructor() {
    super();
    this.model = new PartnerModel();
  }
  protected model: PartnerModel;
  protected DEFAULT_ATTRIBUTE: Partial<PartnerAttributes> = {
    name: "",
    brand_id: "",
    country_id: "",
    city_id: "",
    contact: "",
    affiliation_id: "",
    affiliation_name: "",
    relation_id: "",
    relation_name: "",
    acquisition_id: "",
    acquisition_name: "",
    price_rate: 0,
    authorized_country_ids: [],
    coverage_beyond: false,
    location_id: "",
    website: "",
  };

  public getListPartnerCompanyWithPagination = async (
    limit: number,
    offset: number,
    sort: "name" | "country_name" | "city_name",
    order: SortOrder,
    brandId: string | null,
    filter: {
      affiliation_id?: string;
      relation_id?: string;
      acquisition_id?: string;
    } = {}
  ) => {
    let query = this.model
      .getQuery()
      .select([
        "id",
        "name",
        "country_name",
        "city_name",
        "contact",
        "affiliation_name",
        "relation_name",
        "acquisition_name",
        "price_rate",
        "authorized_country_name",
        "coverage_beyond",
      ]);

    if (brandId) {
      query = query.where("brand_id", "==", brandId);
    }

    if (filter.affiliation_id) {
      query = query.where("affiliation_id", "==", filter.affiliation_id);
    }

    if (filter.relation_id) {
      query = query.where("relation_id", "==", filter.relation_id);
    }

    if (filter.acquisition_id) {
      query = query.where("acquisition_id", "==", filter.acquisition_id);
    }

    query = query.order(sort, order);

    const result = await query.paginate(limit, offset);
    const raw = `
    FOR company IN @companies
    LET cts = (
      FOR contact IN partner_contacts
      FILTER contact.partner_company_id == company.id
      SORT CONCAT(contact.firstname, " ", contact.lastname) ASC
      RETURN CONCAT(UPPER(SUBSTRING(contact.firstname, 0, 1)), SUBSTRING(contact.firstname, 1), " ", UPPER(SUBSTRING(contact.lastname, 0, 1)), SUBSTRING(contact.lastname, 1))
    )
    RETURN MERGE(company, {contact: CONCAT_SEPARATOR(", ", cts)})
    `;
    const mappedContacts = await query.rawQueryV2(raw, {
      companies: result.data,
    });

    return {
      partners: mappedContacts,
      pagination: result.pagination,
    };
  };

  public getOnePartnerCompany = async (id: string, brandId: string) => {
    let query = this.model
      .getQuery()
      .select([
        "name",
        "website",
        "country_id",
        "country_name",
        "state_id",
        "state_name",
        "city_id",
        "city_name",
        "address",
        "postal_code",
        "phone",
        "phone_code",
        "email",
        "affiliation_id",
        "affiliation_name",
        "relation_id",
        "relation_name",
        "acquisition_id",
        "acquisition_name",
        "price_rate",
        "authorized_country_ids",
        "authorized_country_name",
        "coverage_beyond",
        "remark",
        "location_id",
      ])
      .where("brand_id", "==", brandId)
      .where("id", "==", id);

    const result = await query.first();

    return {
      partner: result as PartnerAttributes,
    };
  };

  public getCompanySummary = async (brandId: string) => {
    let result = await this.model
      .getQuery()
      .select(["name", "country_name", "id", "phone_code"])
      .where("brand_id", "==", brandId)
      .where("deleted_at", "==", null)
      .get();

    return {
      company: result,
    };
  };

  public async findDuplicatePartnerByName(
    brandId: string,
    name: string,
    id?: string
  ) {
    let raw = `
    FOR partners IN partners
    FILTER partners.brand_id == @brandId
    FILTER LOWER(partners.name) == LOWER(@name)
    ${id ? "FILTER partners.id != @id" : ""}
    FILTER partners.deleted_at == null
    RETURN {
      id: partners.id,
      name: partners.name
    }
    `;

    let bindData: any = {
      brandId,
      name,
    };
    if (id) {
      bindData = {
        ...bindData,
        id,
      };
    }
    const result = await this.model.rawQueryV2(raw, bindData);
    return result[0];
  }
}

export default new PartnerRepository();
export const partnerRepository = new PartnerRepository();
