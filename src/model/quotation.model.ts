import Model from "./index";
export interface IQuotationAttributes {
  id: string;
  author: string;
  identity: string;
  quotation: string;
  created_at: string;
  is_deleted: boolean;
}
export const QUOTATION_NULL_ATTRIBUTES = {
  id: null,
  author: null,
  identity: null,
  quotation: null,
  created_at: null,
  is_deleted: false,
};
export default class QuotationModel extends Model<IQuotationAttributes> {
  constructor() {
    super("inspirational_quotations");
  }
}
