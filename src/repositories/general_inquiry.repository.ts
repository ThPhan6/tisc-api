import GeneralInquiryModel from "@/model/general_inquiry.model";
import BaseRepository from "@/repositories/base.repository";
import { GeneralInquiryAttribute, ListGeneralInquiryCustom } from "@/types";
class GeneralInquiryRepository extends BaseRepository<GeneralInquiryAttribute> {
  protected model: GeneralInquiryModel;
  protected DEFAULT_ATTRIBUTE: Partial<GeneralInquiryAttribute> = {
    product_id: "",
    title: "",
    message: "",
    inquiry_for_id: "",
    status: 1,
    read: [],
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
  public async getAllInquiryBy(relationId: string) {
    return (await this.model
      .getQuery()
      .join("products", "products.id", "==", "general_inquiries.product_id")
      .where("products.brand_id", "==", relationId)
      .get()) as GeneralInquiryAttribute[];
  }
  public async getListGeneralInquiry(
    relationId: string,
    limit: number,
    offset: number,
    sort: any,
    status: number
  ) {
    const params = {
      relationId,
    };
    const rawQuery = `
      FOR general_inquiries IN general_inquiries
      LIMIT ${offset},${limit}
      FOR products IN products 
      FILTER products.brand_id == @relationId
      FILTER products.id == general_inquiries.product_id
      LET commonType = (
      FOR common_types in common_types
      FILTER common_types.type == 11
      FILTER common_types.id == general_inquiries.inquiry_for_id
      return KEEP(common_types, 'name')
      )
      LET designFirm = (
          FOR users in users
          FILTER users.id == general_inquiries.created_by
          FOR designers in designers 
          FILTER designers.id == users.relation_id
          return {
            design :  KEEP(designers, 'state_name', 'country_name', 'name' ),
            user : KEEP(users, 'firstname')
          }
      )
      ${status ? `FILTER general_inquiries.status == ${status}` : ""}

      ${sort ? `SORT general_inquiries.${sort[0]} ${sort[1]}` : ""}
      RETURN merge({
        general_inquiry : UNSET(general_inquiries,  ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),  
        inquiry_for : commonType[0].name, 
        design_firm : designFirm[0].design,
        inquirer : designFirm[0].user.firstname
      })
    `;
    return (await this.model.rawQueryV2(
      rawQuery,
      params
    )) as ListGeneralInquiryCustom[];
  }

  public async summaryGeneralInquiry() {}
}

export const generalInquiryRepository = new GeneralInquiryRepository();
export default GeneralInquiryRepository;
