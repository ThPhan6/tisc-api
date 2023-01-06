import BaseRepository from "@/repositories/base.repository";
import {
  CustomResouceAttributes,
  CustomResouceType,
  CustomResourceListItem,
  CustomResourcePayload,
  GetCustomResourceListSorting,
} from "@/api/custom_product/custom_product.type";
import { SortOrder } from "@/types";
import { locationRepository } from "@/repositories/location.repository";
import CustomResourceModel from "./custom_resource.model";

export default class CustomResouceRepository extends BaseRepository<CustomResouceAttributes> {
  protected model: CustomResourceModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomResouceAttributes> = {
    website_uri: "",
    location_id: "",
    contacts: [],
    associate_resource_ids: [],
    type: CustomResouceType.Brand,
  };
  constructor() {
    super();
    this.model = new CustomResourceModel();
  }

  public async checkResourceExisted(
    designId: string,
    type: CustomResouceType,
    business_name: string,
    id?: string
  ): Promise<boolean> {
    const result = await this.model.rawQuery(
      `
      FILTER custom_resources.deleted_at == null
      FILTER custom_resources.design_id == @designId
      ${id ? "FILTER custom_resources.id != " + id : ""}
      FILTER custom_resources.type == @type
      FOR loc IN locations
      FILTER loc.id == custom_resources.location_id
      FILTER loc.business_name == @business_name
      FILTER loc.deleted_at == null
      COLLECT WITH COUNT INTO length RETURN length
    `,
      { type, business_name, designId }
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
        FILTER (cr.id IN @associateIds AND @resourceId NOT IN cr.associate_resource_ids)
          OR (cr.id NOT IN @associateIds AND @resourceId IN cr.associate_resource_ids)
        UPDATE cr
        WITH {
          associate_resource_ids: cr.id IN @associateIds AND @resourceId NOT IN cr.associate_resource_ids ?
          UNION_DISTINCT(cr.associate_resource_ids, [@resourceId]) :
            OUTERSECTION(cr.associate_resource_ids, [@resourceId]),
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
    return result;
  }

  public async getTotalByTypeAndRelation(type: CustomResouceType, design_id: string) {
    return await this.model.where('type', '==', type)
      .where('design_id', '==', design_id)
      .count();
  }

  public async getAllByType(
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
        SORT loc.business_name ASC
        RETURN {id: cr.id, name: loc.business_name}
      `,
      { type, designFirmId }
    );
  }

  public async getDistributorsByCompany(
    company_id: string,
    designFirmId: string
  ) {
    return this.model.rawQueryV2(
      `
        FOR cr IN custom_resources
        FILTER cr.deleted_at == null
        FILTER cr.type == @distributorType
        FILTER cr.design_id == @designFirmId
        FILTER @company_id IN cr.associate_resource_ids
        FOR loc IN locations
        FILTER loc.id == cr.location_id
        FILTER loc.deleted_at == null
        COLLECT country = loc.country_name INTO distributorGroup
        RETURN {
          count: lENGTH(distributorGroup),
          country_name: country,
          distributors: (FOR d IN distributorGroup
            RETURN MERGE(
              KEEP(d.cr, 'id', 'contacts', 'location_id'),
              KEEP(d.loc, ${locationRepository.basicAttributesQuery}),
              { phone: d.loc.general_phone, email: d.loc.general_email }
            )
          ),
        }
      `,
      {
        company_id,
        designFirmId,
        distributorType: CustomResouceType.Distributor,
      }
    );
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
        LET created_at = cr.created_at

        SORT ${sort} ${order}
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

  public async checkBrandHaveProduct(companyId: string): Promise<boolean> {
    const result = await this.model.rawQueryV2(
      `
        FOR p IN custom_products
        FILTER p.company_id == @companyId
        FILTER p.deleted_at == null
        COLLECT WITH COUNT INTO length RETURN length
      `,
      { companyId }
    );
    return result[0] > 0;
  }
}

export const customResourceRepository = new CustomResouceRepository();
