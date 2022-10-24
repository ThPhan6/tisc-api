import GeneralInquiryModel from "@/model/general_inquiry.model";
import BaseRepository from "@/repositories/base.repository";
import {
  GeneralInquiryAttribute,
  ListGeneralInquiryCustom,
  SortValidGeneralInquiry,
} from "@/types";
import { isNumber } from "lodash";
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
  public async getAllInquiryBy(
    relationId: string,
    filter?: any
  ): Promise<GeneralInquiryAttribute[]> {
    let query = this.model
      .getQuery()
      .join("products", "products.id", "==", "general_inquiries.product_id")
      .where("products.brand_id", "==", relationId)
      .where("products.deleted_at", "==", null);

    if (isNumber(filter?.status)) {
      query = query.where("status", "==", filter?.status);
    }
    return query.get();
  }

  /**
   *
   * @param relationId brand id
   */
  public async countAllInquiryBy(relationId: string, filter?: any) {
    let query = this.model
      .getQuery()
      .join("products", "products.id", "==", "general_inquiries.product_id")
      .where("products.brand_id", "==", relationId)
      .where("products.deleted_at", "==", null);

    if (isNumber(filter?.status)) {
      query = query.where("status", "==", filter?.status);
    }
    return query.count();
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
      
      FOR products IN products 
      FILTER products.id == general_inquiries.product_id
      FILTER products.brand_id == @relationId
      FILTER products.deleted_at == null

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
          ? `SORT designFirm[0].designer.name ${sortOrder}`
          : ""
      }
      ${
        sort && sort[0] == "firm_location"
          ? `SORT CONCAT_SEPARATOR(' ', designFirm[0].location.city_name, designFirm[0].location.country_name) ${sortOrder}`
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

      LIMIT @offset, @limit
      RETURN {
        id: general_inquiries.id,
        created_at: general_inquiries.created_at,
        title: general_inquiries.title,
        status: general_inquiries.status,
        design_firm: designFirm[0].designer.name,
        firm_location: designFirm[0].location.city_name ? 
            CONCAT(designFirm[0].location.city_name, ', ', designFirm[0].location.country_name) :
            designFirm[0].location.country_name,
        inquirer: TRIM(CONCAT(designFirm[0].user.firstname, ' ', designFirm[0].user.lastname)),
        inquiry_for: inquiryFor[0].name,
        read: POSITION(general_inquiries.read_by, @userId)
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

    FOR user IN users
    FILTER user.id == general_inquiries.created_by
    LET userPhoneCode = (
      FOR loc IN locations
      FILTER loc.id == user.location_id
      RETURN loc.phone_code
    )

    LET designFirm = (
      FOR d IN designers
      FILTER d.id == user.relation_id
      FOR loc IN locations
      FILTER loc.relation_id == d.id
      RETURN MERGE(
        KEEP(d, 'name', 'official_website'), 
        KEEP(loc, 'address', 'city_name', 'state_name', 'country_name', 'general_phone', 'general_email', 'phone_code')
      )
    )

    LET product = (
      FOR products IN products
      FILTER products.id == general_inquiries.product_id
      FOR collection IN collections
      FILTER collection.id == products.collection_id
      FOR brands IN brands
      FILTER brands.id == products.brand_id
      RETURN MERGE(
        KEEP(products, 'id', 'name', 'description'), 
        {collection: collection.name, image: FIRST(products.images)}
      )
    )

    LET inquiryFor = (
      FOR common_types IN common_types
      FILTER common_types.id IN general_inquiries.inquiry_for_ids
      SORT common_types.name ASC
      RETURN common_types.name
    )

    RETURN {
      design_firm: designFirm[0],
      inquiry_message: {
        id: general_inquiries.id,
        inquiry_for: CONCAT_SEPARATOR(', ', inquiryFor),
        title: general_inquiries.title,
        message: general_inquiries.message,
        product: product[0],
        designer: {
          name: TRIM(CONCAT(user.firstname, " " , user.lastname)),
          position: user.position,
          email: user.email,
          phone: user.phone,
          phone_code: userPhoneCode[0]
        }
      }
    }
    `;

    return this.model.rawQuery(rawQuery, params);
  }
}

export const generalInquiryRepository = new GeneralInquiryRepository();
export default GeneralInquiryRepository;
