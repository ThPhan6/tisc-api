import InvoiceModel from "@/model/invoice.model";
import BaseRepository from "./base.repository";
import {
  InvoiceAttributes,
  SortOrder,
  InvoiceCompanyType,
  InvoiceStatus,
} from "@/types";
import { head } from "lodash";

export interface InvoiceWithUserAndServiceType extends InvoiceAttributes {
  service_type_name: string;
  firstname: string;
  lastname: string;
  brand_name: string;
  ordered_by_location_id: string;
}
export interface InvoiceWithRelations extends InvoiceAttributes {
  brand_name: string;
  service_type_name: string;
  created_user: {
    id: string;
    email: string;
    location_id: string;
    location: {
      address: string;
      city_name: string;
      state_name: string;
      country_name: string;
      postal_code: string;
    };
  };
  ordered_user: {
    id: string;
    location_id: string;
    location: {
      brand_location_part_1: string;
      brand_location_part_2: string;
      brand_location_part_3: string;
    };
    email: string;
    firstname: string;
  };
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
    billed_date: "",
    payment_date: "",
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
        "brands.name as brand_name",
        "users.location_id as ordered_by_location_id",
      ])
      .where("invoices.id", "==", id)
      .join("common_types", "common_types.id", "==", "invoices.service_type_id")
      .join("users", "users.id", "==", "invoices.ordered_by")

      .join("brands", "brands.id", "==", "invoices.relation_id")
      .first() as any;
  }

  public findInvoiceWithRelations = async (id: string) => {
    const result = await this.model.rawQueryV2(
      `
      for invoice in invoices 
      filter invoice.id == @id 
          for brand in brands
          filter brand.id == invoice.relation_id
          for commonType in common_types
          filter commonType.id == invoice.service_type_id
          for createdUser in users
          filter createdUser.id == invoice.created_by
          for orderedUser in users
          filter orderedUser.id == invoice.ordered_by
          for createdLocation in locations
          filter createdLocation.id == createdUser.location_id
          let created_location_data = FIRST(return {
              address: createdLocation.address,
              city_name: createdLocation.city_name,
              state_name: createdLocation.state_name,
              country_name: createdLocation.country_name,
              postal_code: createdLocation.postal_code,
          })
          for orderedLocation in locations
          filter orderedLocation.id == orderedUser.location_id
          LET location_data = orderedLocation.country_id == '-1' ? FIRST(
              return {
                  brand_location_part_1: orderedLocation.country_name,
                  brand_location_part_2: "",
                  brand_location_part_3: "",
              }
          ) : FIRST(
              return {
                  brand_location_part_1: concat(orderedLocation.address,', ', orderedLocation.city_name),
                  brand_location_part_2: orderedLocation.state_name,
                  brand_location_part_3: concat(orderedLocation.country_name,', ', orderedLocation.postal_code),
              }
          )
      
      return merge(UNSET(invoice, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
          created_user: {
              id: createdUser.id,
              location_id: createdUser.location_id,
              location: created_location_data,
              email: createdUser.email,
          }, 
          ordered_user: {
              id: orderedUser.id,
              location_id: orderedUser.location_id,
              location: location_data,
              firstname: orderedUser.firstname,
              lastname: orderedUser.lastname,
              email: orderedUser.email,
          },
          brand_name: brand.name,
          service_type_name: commonType.name
      })
    `,
      { id }
    );
    return result[0] as InvoiceWithRelations;
  };

  public async getWithUserAndServiceType(
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder,
    relationId?: string
  ): Promise<ListInvoicesWithPagination> {
    let query = this.model
      .getQuery()
      .select([
        "invoices.*",
        "common_types.name as service_type_name",
        "users.firstname as firstname",
        "users.lastname as lastname",
        "brands.name as brand_name",
      ])
      .join("common_types", "common_types.id", "==", "invoices.service_type_id")
      .join("users", "users.id", "==", "invoices.ordered_by")
      .join("brands", "brands.id", "==", "invoices.relation_id")
      .where("invoices.deleted_at", "==", null)
      .order(sort ? sort : "created_at", order || "DESC");

    if (relationId) {
      query = query
        .where("invoices.relation_id", "==", relationId)
        .where("invoices.status", "!=", InvoiceStatus.Pending);
    }
    return query.paginate(limit, offset);
  }

  public async summary(relationId?: string, relationType?: InvoiceCompanyType) {
    let params = {} as any;
    if (relationId && relationType) {
      params = { relationId, relationType };
    }
    const summary = await this.model.rawQueryV2(
      `
      LET summary = (
          FOR invoice IN invoices
            FILTER invoice.deleted_at == null
            ${
              relationId && relationType
                ? "FILTER invoice.relation_id == @relationId AND invoice.relation_type == @relationType"
                : ""
            }
            LET totalGross = invoice.quantity * invoice.unit_rate
            LET saleTaxAmount = (invoice.tax / 100) * totalGross
            LET grandTotal = totalGross + saleTaxAmount
          return {
              grandTotal: grandTotal
          }
      )
      RETURN {
          grandTotal: SUM(summary[*].grandTotal)
      }
    `,
      params
    );
    return head(summary) as {
      grandTotal: number;
    };
  }
}

export const invoiceRepository = new InvoiceRepository();

export default InvoiceRepository;
