import GeneralInquiryModel from "@/model/general_inquiry.model";
import BaseRepository from "@/repositories/base.repository";
import { GeneralInquiryAttribute, SortOrder } from "@/types";
class GeneralInquiryRepository extends BaseRepository<GeneralInquiryAttribute> {
  protected model: GeneralInquiryModel;
  protected DEFAULT_ATTRIBUTE: Partial<GeneralInquiryAttribute> = {
    product_id: "",
    title: "",
    message: "",
    inquiry_for_ids: [],
    status: 1,
    read: [],
    created_at: "",
    created_by: "",
  };
  constructor() {
    super();
    this.model = new GeneralInquiryModel();
  }

  public async getListGeneralInquiry(
    relationId: string,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder,
    filter?: any
  ) {
    return this.model
      .getQuery()
      .join("designers", "designers.id", "==", relationId)
      .get();
  }
}

export const generalInquiryRepository = new GeneralInquiryRepository();
export default GeneralInquiryRepository;
