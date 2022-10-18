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

    if (filter?.status) {
      query = query.where("status", "==", filter?.status);
    }
    return (await query.get()) as GeneralInquiryAttribute[];
  }
  public async getListGeneralInquiry(
    userId: string,
    relationId: string,
    limit: number,
    offset: number,
    sort: SortValidGeneralInquiry,
    filter: any
  ) {
    const sortOrder = sort?.[1] || "ASC";
    const params = {
      userId,
      relationId,
      limit,
      offset,
    };
    const rawQuery = `
      FILTER general_inquiries.deleted_at == null
      ${
        typeof filter?.status === "number"
          ? `FILTER general_inquiries.status == ${filter?.status}`
          : ""
      }
      ${
        sort && sort[0] === "created_at"
          ? `SORT general_inquiries.created_at ${sortOrder}`
          : ""
      }

      LIMIT @offset, @limit
      
      FOR products IN products 
      FILTER products.brand_id == @relationId
      FILTER products.id == general_inquiries.product_id

      LET designFirm = (
        FOR u IN users
        FILTER u.id == general_inquiries.created_by
        FOR d IN designers 
        FILTER d.id == u.relation_id
        FOR loc IN locations 
        FILTER loc.relation_id == d.id
        RETURN { designer: d, location: loc, user: u }
      )
      ${
        sort && sort[0] === "design_firm"
          ? `SORT designFirm.designer.name ${sortOrder}`
          : ""
      }
      ${
        sort && sort[0] == "firm_location"
          ? `SORT CONCAT_SEPARATOR(' ', designFirm.location.state_name, designFirm.location.country_name) ${sortOrder}`
          : ""
      }

      LET inquiryFor = (
        FOR common_types IN common_types
        FILTER common_types.id IN general_inquiries.inquiry_for_ids
        SORT common_types.name ASC
        RETURN common_types
      )
      ${
        sort && sort[0] === "inquiry_for"
          ? `SORT FIRST(inquiryFor).name ${sortOrder}`
          : ""
      }

      RETURN {
        id: general_inquiries.id,
        created_at: general_inquiries.created_at,
        title: general_inquiries.title,
        status: general_inquiries.status,
        design_firm: designFirm[0].designer.name,
        firm_state_name: designFirm[0].location.state_name,
        firm_country_name: designFirm[0].location.country_name,
        inquirer_firstname: designFirm[0].user.firstname,
        inquirer_lastname: designFirm[0].user.lastname,
        inquiry_for: inquiryFor[0].name,
        read: POSITION( general_inquiries.read_by, @userId)
      }
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
      FOR locations IN locations
      FILTER locations.id == users.location_id
      RETURN MERGE(
        KEEP(designers, 'name', 'official_website'), 
        {
          inquirer : CONCAT(users.firstname, " " ,users.lastname),
          position : users.position,
          work_email : users.email,
          work_phone : users.phone,
          work_phone_code : users.phone_code,
          general_email : locations.general_email, 
          general_phone :  locations.general_phone,
          general_phone_code : locations.phone_code,
          address: CONCAT_SEPARATOR(', ', locations.address, locations.city_name, locations.state_name, locations.country_name)
        }
      )
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
      design_firm : {
        general_email : designFirm[0].general_email, 
        general_phone :  designFirm[0].general_phone,
        general_phone_code : designFirm[0].general_phone_code,
        address: CONCAT_SEPARATOR(', ', designFirm[0].address, designFirm[0].city_name, designFirm[0].state_name, designFirm[0].country_name),
        name : designFirm[0].name, 
        official_website : designFirm[0].official_website
      },
      inquiry_message : {
        id : general_inquiries.id,
        inquiry_for : inquiryFor[0],
        title : general_inquiries.title,
        message : general_inquiries.message,
        product_id : products[0].id,
        product_collection : products[0].collection,
        product_description : products[0].description,
        product_image : products[0].image,
        official_website : products[0].official_website.url,
        inquirer : designFirm[0].inquirer,
        position : designFirm[0].position,
        work_email : designFirm[0].work_email,
        work_phone : designFirm[0].work_phone,
        work_phone_code : designFirm[0].work_phone_code
      }
    }
    `;

    return this.model.rawQuery(rawQuery, params);
  }
}

export const generalInquiryRepository = new GeneralInquiryRepository();
export default GeneralInquiryRepository;
