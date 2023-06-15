import BaseRepository from "@/repositories/base.repository";
import {
  CustomProductAttributes,
  CustomProductPayload,
  CustomProductWithRelation,
} from "./custom_product.type";
import CustomProductModel from "./custom_product.model";
import { locationRepository } from "@/repositories/location.repository";
import { DEFAULT_USER_SPEC_SELECTION } from "../user_product_specification/user_product_specification.model";

export default class CustomProductRepository extends BaseRepository<CustomProductAttributes> {
  protected model: CustomProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomProductAttributes> = {
    name: "",
    description: "",
    images: [],
    attributes: [],
    specifications: [],
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
    collectionId: string,
    limit?: number,
    offset?: number
  ) {
    return this.model.rawQuery(
      `
      FILTER custom_products.deleted_at == null
      FILTER custom_products.design_id == @designId
      ${companyId ? "FILTER custom_products.company_id == @companyId" : ""}
      FOR cr IN custom_resources
      FILTER cr.id == custom_products.company_id
      FILTER cr.deleted_at == null
      FOR loc IN locations
      FILTER loc.id == cr.location_id
      FILTER loc.deleted_at == null
      FOR col IN collections
      FILTER col.id == custom_products.collection_id
      ${collectionId ? "FILTER col.id == @collectionId" : ""}
      FILTER col.deleted_at == null
      SORT custom_products.updated_at DESC
      LIMIT ${offset}, ${limit}
      RETURN MERGE(
        KEEP(custom_products, 'id', 'name', 'description', 'company_id', 'collection_id'),
        {
          image: FIRST(custom_products.images),
          company_name: loc.business_name,
          collection_name: col.name,
        }
      )
    `,
      { designId, companyId, collectionId }
    );
  }

  public async getOne(
    productId: string,
    userId: string
  ): Promise<CustomProductPayload> {
    const result = await this.model.rawQuery(
      `
        FILTER custom_products.id == @productId
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
        
        LET specification = FIRST(
          FOR selection IN user_product_specifications
          FILTER selection.custom_product == true
          FILTER selection.product_id == @productId
          FILTER selection.user_id == @userId
          RETURN selection.specification
        ) || @defaultSpec
        
        RETURN MERGE(
          UNSET(custom_products, ['_id', '_key', '_rev', 'deleted_at']),
          {
            company_name: loc.business_name,
            collection_name: col.name,
            location: KEEP(loc, ${locationRepository.basicAttributesQuery}),
            specification,
            specifications: custom_products.specifications ? custom_products.specifications : []
          }
        )
      `,
      { productId, userId, defaultSpec: DEFAULT_USER_SPEC_SELECTION }
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
      ${id ? "FILTER custom_products.id != @id" : ""}
      COLLECT WITH COUNT INTO length RETURN length
    `,
      { designId, name, id }
    );
    return result[0] > 0;
  }
  public async findWithRelationData(productId: string) {
    let params = {} as any;
    if (productId) {
      params = { productId };
    }
    const result = await this.model.rawQueryV2(
      `
      for cp in custom_products 
      filter cp.id == @productId 
          for d in designers
          filter d.id == cp.design_id
          for c in collections
          filter c.id == cp.collection_id
      return merge(UNSET(cp, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
          design: {
              name: d.name,
              logo: d.logo
          }, 
          collection: {
              name: c.name
          }
      })
    `,
      params
    );
    return result[0] as CustomProductWithRelation;
  }
}
export const customProductRepository = new CustomProductRepository();
