import QuotationModel from "@/model/quotation.model";
import { SortOrder } from "@/types";
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
    sort: string,
    order: SortOrder
  ): Promise<ListQuotationWithPagination> {
    return this.model.select().order(sort, order).paginate(limit, offset);
  }
}
export default QuotationRepository;
