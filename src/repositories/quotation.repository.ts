import QuotationModel from "@/models/quotation.model";
import {
  SortOrder,
  IQuotationAttributes,
  ListQuotationWithPagination,
} from "@/types";
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
    _filter: any,
    sort: string,
    order: SortOrder
  ): Promise<ListQuotationWithPagination> {
    return this.model.select().order(sort, order).paginate(limit, offset);
  }
}
export default QuotationRepository;
