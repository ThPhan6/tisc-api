import { COMMON_TYPES } from "@/constants";
import GeneralInquiryModel from "@/model/general_inquiry.model";
import BaseRepository from "@/repositories/base.repository";
import {
  GeneralInquiryAttribute,
  ListGeneralInquiryCustom,
  SortValidGeneralInquiry,
} from "@/types";
class GeneralInquiryRepository extends BaseRepository<GeneralInquiryAttribute> {
  protected model: GeneralInquiryModel;
  protected DEFAULT_ATTRIBUTE: Partial<GeneralInquiryAttribute> = {
    product_id: "",
    title: "",
    message: "",
    inquiry_for_ids: [],
    status: 1,
    read_by: [],
    created_at: "",
    created_by: "",
  };
  constructor() {
    super();
    this.model = new GeneralInquiryModel();
  }

  /**
   *
   * @param relationId brand id
   */
  public async getAllInquiryBy(relationId: string, filter?: any) {
    let query = this.model
      .getQuery()
      .join("products", "products.id", "==", "general_inquiries.product_id")
      .where("products.brand_id", "==", relationId);

    if (filter && filter.status) {
      query = query.where("status", "==", filter.status);
    }
    return (await query.get()) as GeneralInquiryAttribute[];
  }
  public async getListGeneralInquiry(
    relationId: string,
    limit: number,
    offset: number,
    sort: SortValidGeneralInquiry,
    filter: any
  ) {
    const params = {
      relationId,
      limit,
      offset,
    };
    const rawQuery = `
    FILTER general_inquiries.deleted_at == null
    ${
      filter.status ? `FILTER general_inquiries.status == ${filter.status}` : ""
    }
      ${
        sort && sort[0] === "created_at"
          ? `SORT general_inquiries.created_at ${sort[1]}`
          : ""
      }

      LIMIT @offset,@limit
      
      FOR products IN products 
      FILTER products.brand_id == @relationId
      FILTER products.id == general_inquiries.product_id

      LET designFirm = (
        FOR users IN users
        FILTER users.id == general_inquiries.created_by
        FOR designers IN designers 
        FILTER designers.id == users.relation_id
        ${
          sort && sort[0] === "design_firm"
            ? `SORT designers.name ${sort[1]}`
            : ""
        }
        ${
          sort && sort[0] == "firm_location"
            ? `SORT designers.state_name ${sort[1]}`
            : ""
        }
        RETURN {
          design :  KEEP(designers, 'state_name', 'country_name', 'name' ),
          user : KEEP(users, 'firstname')
        }
      )

      LET inquiryFor = (
        FOR inquiryId IN general_inquiries.inquiry_for_ids
            FOR common_types IN common_types
            FILTER inquiryId == common_types.id
            SORT common_types.name ASC
        RETURN common_types
    )

    ${
      sort && sort[0] === "inquiry_for"
        ? `SORT inquiryFor[0].name ${sort[1]}`
        : ""
    }
      RETURN MERGE({
        general_inquiry : UNSET(general_inquiries,  ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
        design_firm : designFirm[0].design,
        inquiries_for :inquiryFor,
        inquirer : designFirm[0].user.firstname
      })
    `;

    return (await this.model.rawQuery(
      rawQuery,
      params
    )) as ListGeneralInquiryCustom[];
  }

  public async getDetailGeneralInquiry(id: string) {
    const params = { id } as any;
    const rawQuery = `
    FILTER general_inquiries.deleted_at == null
    FILTER general_inquiries.id == @id

    LET designFirm = (
      FOR users IN users
      FILTER users.id == general_inquiries.created_by
      FOR designers IN designers
      FILTER designers.id == users.relation_id
      RETURN MERGE(UNSET(designers, ['_id', '_key','_rev','deleted_at']), KEEP(users,'email', 'phone'))
    )

    LET products = (
      FOR products IN products
      FILTER products.id == general_inquiries.product_id
      FOR collections IN collections
      FILTER collections.id == products.collection_id
      FOR brands IN brands
      FILTER brands.id == products.brand_id
      RETURN {
          image : products.images[0],
          id : products.id,
          name : products.name,
          collection : collections.name,
          description : products.description,
          official_website : brands.official_websites[0]
      }
    )

    LET inquiryFor = (
      FOR inquiryId IN general_inquiries.inquiry_for_ids
            FOR common_types IN common_types
            FILTER inquiryId == common_types.id
            SORT common_types.name ASC
        RETURN common_types.name

    )

    RETURN {
      product_name : products[0].name,
      design_firm : designFirm[0],
      inquiry_message : {
          id : general_inquiries.id,
          inquiry_for : inquiryFor[0],
          title : general_inquiries.title,
          message : general_inquiries.message,
          product_id : products[0].id,
          product_collection : products[0].collection,
          product_description : products[0].description,
          product_image : products[0].image,
          official_website : products[0].official_website.url
        }
    }
    `;

    return this.model.rawQuery(rawQuery, params);
  }
}

export const generalInquiryRepository = new GeneralInquiryRepository();
export default GeneralInquiryRepository;
