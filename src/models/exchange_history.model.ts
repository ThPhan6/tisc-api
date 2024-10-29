import Model from "@/Database/Model";
import { ExchangeHistoryEntity } from "@/types";

export default class ExchangeHistoryModel extends Model<ExchangeHistoryEntity> {
  protected table = "exchange_histories";
  protected softDelete = true;
}
