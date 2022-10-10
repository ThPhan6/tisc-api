import AutoEmailModel from "@/model/auto_email.models";
import {
  IAutoEmailAttributes,
  ListAutoEmailWithPaginate,
} from "@/types/auto_email.type";
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
    filter: any,
    sort: any
  ) {
    let result: ListAutoEmailWithPaginate;
    if (sort) {
      result = await this.model
        .select()
        .order(sort[0], sort[1])
        .paginate(limit, offset);
    }

    result = await this.model.select().paginate(limit, offset);
    return result;
  }
}
export default AutoEmailRepository;
