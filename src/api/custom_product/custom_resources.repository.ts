import BaseRepository from "@/repositories/base.repository";
import CustomResouceModel from "@/api/custom_product/custom_resources.model";
import {
  CustomResouceAttribute,
  CustomResouceType,
  CustomResourceListItem,
  CustomResourcePayload,
  GetCustomResourceListSorting,
} from "@/api/custom_product/custom_product.type";
import { SortOrder } from "@/types";
import { locationRepository } from "@/repositories/location.repository";

export default class CustomResouceRepository extends BaseRepository<CustomResouceAttribute> {
  protected model: CustomResouceModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomResouceAttribute> = {
    website_uri: "",
    location_id: "",
    contacts: [],
    associate_resource_ids: [],
    type: CustomResouceType.Brand,
  };
  constructor() {
    super();
    this.model = new CustomResouceModel();
  }

  public async checkResourceExisted(
    type: CustomResouceType,
    business_name: string,
    id?: string
  ): Promise<boolean> {
    const result = await this.model.rawQuery(
      `
      FILTER custom_resources.deleted_at == null
      ${id ? "FILTER custom_resources.id != " + id : ""}
      FILTER custom_resources.type == @type
      FOR loc IN locations
      FILTER loc.id == custom_resources.location_id
      FILTER loc.business_name == @business_name
      FILTER loc.deleted_at == null
      COLLECT WITH COUNT INTO length RETURN length
    `,
      { type, business_name }
    );
    return result[0] > 0;
  }

  public async updateAssociateResources(
    resourceId: string,
    resourceType: CustomResouceType,
    associateIds: string[]
  ): Promise<boolean> {
    const result = await this.model.rawQueryV2(
      `
        FOR cr IN custom_resources
        FILTER cr.deleted_at == null
        FILTER cr.type == @updatingType
        FILTER cr.id IN @associateIds OR @resourceId IN cr.associate_resource_ids
        UPDATE cr 
        WITH { 
          associate_resource_ids: OUTERSECTION(cr.associate_resource_ids, [@resourceId]),
          updated_at: @now
        }
        IN custom_resources
      `,
      {
        resourceId,
        associateIds,
        updatingType:
          resourceType === CustomResouceType.Brand
            ? CustomResouceType.Distributor
            : CustomResouceType.Brand,
        now: new Date(),
      }
    );
    console.log("updateAssociateResources", result);
    return result;
  }

  public async getTotalByType(type: CustomResouceType) {
    const result = await this.model.rawQueryV2(
      `
        FOR cr IN custom_resources
        FILTER cr.deleted_at == null
        FILTER cr.type == @type
        COLLECT WITH COUNT INTO length RETURN length
      `,
      { type }
    );
    return result[0];
  }

  public async getList(
    limit: number,
    offset: number,
    sort: GetCustomResourceListSorting,
    order: SortOrder,
    type: CustomResouceType,
    designFirmId: string
  ): Promise<CustomResourceListItem[]> {
    return this.model.rawQueryV2(
      `
        FOR cr IN custom_resources
        FILTER cr.deleted_at == null
        FILTER cr.type == @type
        FILTER cr.design_id == @designFirmId
        FOR loc IN locations
        FILTER loc.id == cr.location_id
        FILTER loc.deleted_at == null

        LET cards = cr.type == @brandResource ? FIRST(
          FOR cp IN custom_products
          FILTER cp.company_id == cr.id
          FILTER cp.deleted_at == null
          COLLECT WITH COUNT INTO length RETURN length
        ) : 0

        LET distributors = cr.type == @brandResource ? LENGTH(cr.associate_resource_ids) : 0

        LET brands = cr.type == @distributorResource ? LENGTH(
          FOR crs IN custom_resources
          FILTER crs.deleted_at == null
          FILTER crs.type == @brandResource
          FILTER cr.id IN crs.associate_resource_ids
          RETURN DISTINCT crs.id
        ) : 0
        
        LET location = ${locationRepository.getShortLocationQuery("loc")}
        LET business_name = loc.business_name

        SORT @sort @order
        LIMIT @offset, @limit
        RETURN MERGE(
          KEEP(loc, 'business_name', 'general_email', 'general_phone', 'phone_code'),
          {
            id: cr.id,
            location,
            contacts: LENGTH(cr.contacts),
            distributors,
            cards,
            brands,
          }
        )
      `,
      {
        limit,
        offset,
        sort,
        order,
        type,
        brandResource: CustomResouceType.Brand,
        distributorResource: CustomResouceType.Distributor,
        designFirmId,
      }
    );
  }

  public async getSummary(designFirmId: string): Promise<{
    companies: number;
    distributors: number;
    contacts: number;
  }> {
    const summary = await this.model.rawQueryV2(
      `
        LET resources = (
          FOR cr IN custom_resources
          FILTER cr.deleted_at == null
          FILTER cr.design_id == @designFirmId
          RETURN {type: cr.type, contacts: LENGTH(cr.contacts)}
        )

        LET companies = FIRST(
          FOR rs IN resources
          FILTER rs.type == @brandResource
          COLLECT WITH COUNT INTO length RETURN length
        )

        LET contacts = SUM(
          FOR rs IN resources
          RETURN rs.contacts
        )

        RETURN {
          companies,
          distributors: LENGTH(resources) - companies,
          contacts,
        }
      `,
      { designFirmId, brandResource: CustomResouceType.Brand }
    );
    return summary[0];
  }

  public async getOne(id: string): Promise<CustomResourcePayload> {
    const result = await this.model.rawQuery(
      `
        FILTER custom_resources.id == @id
        FILTER custom_resources.deleted_at == null
        FOR loc IN locations
        FILTER loc.id == custom_resources.location_id
        FILTER loc.deleted_at == null
        RETURN MERGE(
          KEEP(custom_resources, 'id', 'type', 'website_uri', 'associate_resource_ids', 'contacts', 'design_id'),
          KEEP(loc, ${locationRepository.basicAttributesQuery}, 'business_name', 'general_phone', 'general_email')
        )
      `,
      { id }
    );
    return result[0];
  }

  public async checkBrandHaveProduct(brandId: string): Promise<boolean> {
    const result = await this.model.rawQueryV2(
      `
        FOR p IN custom_products
        FILTER p.design_id == @brandId
        FILTER p.deleted_at == null
        COLLECT WITH COUNT INTO length RETURN length
      `,
      { brandId }
    );
    return result[0] > 0;
  }
}

export const customResourceRepository = new CustomResouceRepository();
