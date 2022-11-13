import InvoiceModel from "@/model/invoice.model";
import BaseRepository from "./base.repository";
import { InvoiceAttributes, SortOrder, InvoiceCompanyType } from "@/types";
import {head} from 'lodash';

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
    relation_id: "",
    relation_type: InvoiceCompanyType.Brand,
    ordered_by: "",
    unit_rate: 0,
    quantity: 0,
    tax: 0,
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
    order: SortOrder,
    relationId?: string,
  ): Promise<ListInvoicesWithPagination> {
    let query = this.model
      .getQuery()
      .select([
        "invoices.*",
        "common_types.name as service_type_name",
        "users.firstname as firstname",
        "users.lastname as lastname",
      ])
      .join("common_types", "common_types.id", "==", "invoices.service_type_id")
      .join("users", "users.id", "==", "invoices.created_by")
      .order(sort ? sort : "created_at", order || "DESC");

      if (relationId) {
        query = query.where('invoices.relation_id', '==', relationId);
      }
      return query.paginate(limit, offset);
  }

  public async summary(relationId?: string, relationType?: InvoiceCompanyType) {
    let params = {} as any;
    if (relationId && relationType) {
      params = { relationId, relationType };
    }
    const summary = await this.model.rawQuery(`
      LET summary = (
          FOR invoices IN invoices
            FILTER invoices.deleted_at == null
            ${relationId && relationType ?
              'FILTER invoices.relation_id == @relationId AND invoices.relation_type == @relationType'
              : ''}
            LET totalGross = invoices.quantity * invoices.unit_rate
            LET saleTaxAmount = (invoices.tax / 100) * totalGross
            LET grandTotal = totalGross + saleTaxAmount
          return {
              grandTotal: grandTotal
          }
      )
      RETURN {
          grandTotal: SUM(summary[*].grandTotal)
      }
    `, params);
    return head(summary) as {
      grandTotal: number;
    }
  }

}

export const invoiceRepository = new InvoiceRepository();

export default InvoiceRepository;
