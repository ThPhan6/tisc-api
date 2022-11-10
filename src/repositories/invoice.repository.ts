import InvoiceModel from "@/model/invoice.model";
import BaseRepository from "./base.repository";
import { InvoiceAttributes, SortOrder } from "@/types";

export interface InvoiceWithUserAndServiceType extends InvoiceAttributes {
  service_type_name: string;
  firstname: string;
  lastname: string;
}
export interface ListInvoicesWithPagination {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: InvoiceWithUserAndServiceType[];
}
class InvoiceRepository extends BaseRepository<InvoiceAttributes> {
  protected model: InvoiceModel;
  protected DEFAULT_ATTRIBUTE: Partial<InvoiceAttributes> = {
    id: "",
    service_type_id: "",
    brand_id: "",
    ordered_by: "",
    unit_rate: 0,
    quantity: 0,
    tax: 0,
    billing_amount: 0,
    due_date: "",
    remark: "",
    created_by: "",
    created_at: "",
  };

  constructor() {
    super();
    this.model = new InvoiceModel();
  }
  public async findWithUserAndServiceType(
    id: string
  ): Promise<InvoiceWithUserAndServiceType> {
    return this.model
      .getQuery()
      .select([
        "invoices.*",
        "common_types.name as service_type_name",
        "users.firstname as firstname",
        "users.lastname as lastname",
      ])
      .where("invoices.id", "==", id)
      .join("common_types", "common_types.id", "==", "invoices.service_type_id")
      .join("users", "users.id", "==", "invoices.created_by")
      .first() as any;
  }
  public async getWithUserAndServiceType(
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ): Promise<ListInvoicesWithPagination> {
    return this.model
      .getQuery()
      .select([
        "invoices.*",
        "common_types.name as service_type_name",
        "users.firstname as firstname",
        "users.lastname as lastname",
      ])
      .join("common_types", "common_types.id", "==", "invoices.service_type_id")
      .join("users", "users.id", "==", "invoices.created_by")
      .order(sort ? sort : "created_at", order || "DESC")
      .paginate(limit, offset);
  }
}

export const invoiceRepository = new InvoiceRepository();

export default InvoiceRepository;
