import BaseRepository from "@/repositories/base.repository";
import {
  CustomProductAttributes,
  CustomProductPayload,
} from "./custom_product.type";
import CustomProductModel from "./custom_product.model";

export default class CustomProductRepository extends BaseRepository<CustomProductAttributes> {
  protected model: CustomProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomProductAttributes> = {
    name: "",
    description: "",
    images: [],
    attributes: [],
    specification: [],
    options: [],
    collection_id: "",
    company_id: "",
    design_id: "",
  };

  constructor() {
    super();
    this.model = new CustomProductModel();
  }

  public async getList(
    designId: string,
    companyId: string,
    collectionId: string
  ) {
    return this.model.rawQuery(
      `
      FILTER custom_products.deleted_at == null
      FILTER custom_products.design_id == @designId
      FOR cr IN custom_resources
      FILTER cr.id == ${companyId ? "@companyId" : "custom_products.company_id"}
      FILTER cr.deleted_at == null
      FOR loc IN locations
      FILTER loc.id == cr.location_id
      FILTER loc.deleted_at == null
      FOR col IN collections
      FILTER col.id == ${
        collectionId ? "@collectionId" : "custom_products.collection_id"
      }
      FILTER col.deleted_at == null
      SORT custom_products.updated_at DESC
      RETURN MERGE(
        KEEP(custom_products, 'id', 'name', 'description', 'company_id', 'collection_id'),
        {
          image: FIRST(cr.images),
          company_name: loc.business_name,
          collection_name: col.name,
        }
      )
    `,
      { designId, companyId, collectionId }
    );
  }

  public async getOne(id: string): Promise<CustomProductPayload> {
    const result = await this.model.rawQuery(
      `
        FILTER custom_products.id == @id
        FILTER custom_products.deleted_at == null
        FOR cr IN custom_resources
        FILTER cr.deleted_at == null
        FILTER cr.id == custom_products.company_id
        FOR loc IN locations
        FILTER loc.id == cr.location_id
        FILTER loc.deleted_at == null
        FOR col IN collections
        FILTER col.id == custom_products.collection_id
        FILTER col.deleted_at == null
        RETURN MERGE(
          UNSET(custom_products, ['_id', '_key', '_rev', 'deleted_at', 'design_id']),
          {
            company_name: loc.business_name,
            collection_name: col.name,
          }
        )
      `,
      { id }
    );
    return result[0];
  }

  public async checkExisted(
    designId: string,
    name: string,
    id?: string
  ): Promise<boolean> {
    const result = await this.model.rawQuery(
      `
      FILTER custom_products.deleted_at == null
      FILTER custom_products.design_id == @designId
      FILTER custom_products.name == @name
      ${id ? "FILTER custom_products.id != " + id : ""}
      COLLECT WITH COUNT INTO length RETURN length
    `,
      { designId, name }
    );
    return result[0] > 0;
  }
}
export const customProductRepository = new CustomProductRepository();
