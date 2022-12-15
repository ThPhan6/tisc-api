import AutoEmailModel from "@/model/auto_email.model";
import {
  SortOrder,
  IAutoEmailAttributes,
  ListAutoEmailWithPaginate,
} from "@/types";
import BaseRepository from "./base.repository";

class AutoEmailRepository extends BaseRepository<IAutoEmailAttributes> {
  protected model: AutoEmailModel;
  constructor() {
    super();
    this.model = new AutoEmailModel();
  }

  public async getListAutoEmailWithPagination(
    limit: number,
    offset: number,
    _filter: any,
    sort: string,
    order: SortOrder
  ) {
    let result: ListAutoEmailWithPaginate;
    if (sort) {
      result = await this.model
        .select()
        .order(sort, order)
        .paginate(limit, offset);
    } else {
      result = await this.model.select().paginate(limit, offset);
    }
    return result;
  }
}
export default AutoEmailRepository;
export const autoEmailRepository = new AutoEmailRepository();
