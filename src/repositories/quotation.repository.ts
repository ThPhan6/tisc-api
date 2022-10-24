import QuotationModel from "@/model/quotation.model";
import {
  IQuotationAttributes,
  ListQuotationWithPagination,
} from "@/types/quotation.type";
import BaseRepository from "./base.repository";

class QuotationRepository extends BaseRepository<IQuotationAttributes> {
  protected model: QuotationModel;
  protected DEFAULT_ATTRIBUTE: Partial<IQuotationAttributes> = {
    author: "",
    identity: "",
    quotation: "",
    created_at: "",
  };
  constructor() {
    super();
    this.model = new QuotationModel();
  }

  public async getListQuotationWithPagination(
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ) {
    if (sort) {
      return (await this.model
        .select()
        .order(sort[0], sort[1])
        .paginate(limit, offset)) as ListQuotationWithPagination;
    }
    return (await this.model
      .select()
      .paginate(limit, offset)) as ListQuotationWithPagination;
  }
}
export default QuotationRepository;
