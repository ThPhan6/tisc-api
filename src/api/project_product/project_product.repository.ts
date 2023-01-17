import ProjectProductModel, {
  ProjectProductAttributes,
} from "@/api/project_product/project_product.model";
import { ProductSpecifyStatus } from "@/api/project_product/project_product.type";
import BaseRepository from "@/repositories/base.repository";
import {
  AssignProductToProjectRequest,
  OrderMethod,
  ProductConsiderStatus,
  ProjectProductStatus,
} from "./project_product.type";
import { v4 as uuidv4 } from "uuid";
import { ENVIRONMENT } from "@/config";
import {
  BrandAttributes,
  SortOrder,
  IProjectZoneAttributes,
  Availability,
  SummaryItemPosition,
  UserStatus,
} from "@/types";
import { COMMON_TYPES } from "@/constants";
import { getDefaultDimensionAndWeightAttribute } from "@/api/attribute/attribute.mapping";
import { locationRepository } from "@/repositories/location.repository";
import { DEFAULT_USER_SPEC_SELECTION } from "../user_product_specification/user_product_specification.model";

class ProjectProductRepository extends BaseRepository<ProjectProductAttributes> {
  protected model: ProjectProductModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductAttributes> = {
    id: "",
    project_id: "",
    product_id: "",

    status: ProjectProductStatus.consider,
    consider_status: ProductConsiderStatus.Considered,

    allocation: [],
    entire_allocation: true,

    brand_location_id: "",
    distributor_location_id: "",

    material_code_id: "",
    material_code: "",
    suffix_code: "",
    description: "",
    quantity: 0,
    order_method: OrderMethod["Direct Purchase"],
    requirement_type_ids: [],
    instruction_type_ids: [],
    finish_schedule_ids: [],
    unit_type_id: "",
    special_instructions: "",

    created_at: "",
    created_by: "",
    updated_at: "",
  };

  constructor() {
    super();
    this.model = new ProjectProductModel();
  }

  private basicOptionQuery = `pp.custom_product == true ? (
    LET basisIds = (
      FOR specGroup IN pp.specification.attribute_groups
      FOR basis IN specGroup.attributes
      RETURN basis.basis_option_id
    )
    FOR option IN (product.options || [])
    FOR optionItem IN option.items
    FILTER optionItem.id IN basisIds
    RETURN {
      variant: optionItem.description,
      productCode: optionItem.product_id
    }
  ) : (
    LET options = (
      FILTER pp.specification != null && pp.specification.attribute_groups != null
      FOR specification IN pp.specification.attribute_groups
      FOR specAttribute IN specification.attributes
        FOR attributes IN attributes
        FILTER attributes.subs != null
        FOR attr IN attributes.subs
        FILTER attr.id == specAttribute.id
          FOR basis IN bases
          FILTER basis.subs != null
          FOR basicAttr IN basis.subs
          FILTER basicAttr.id == attr.basis_id
          FILTER basicAttr.subs != null
            FOR option IN basicAttr.subs
            FILTER option.id == specAttribute.basis_option_id
      RETURN CONCAT(attr.name, ': ', option.value_1, ' ', option.unit_1,
        ' - ', option.value_2, ' ', option.unit_2)
    )
    LET productCode = (
      FILTER pp.specification != null
      FILTER pp.specification.attribute_groups != null
      FOR specification IN pp.specification.attribute_groups
      FILTER product.specification_attribute_groups != null
          FOR productSpecification IN product.specification_attribute_groups
              FILTER specification.id == productSpecification.id
              FILTER specification.attributes != null
              FOR attribute IN specification.attributes
              FILTER productSpecification.attributes != null
                  FOR productSpecificationAttribute IN productSpecification.attributes
                      FILTER productSpecificationAttribute.type == 'Options'
                      FILTER attribute.id == productSpecificationAttribute.id
                      FILTER productSpecificationAttribute.basis_options != null
                          FOR optionCode IN productSpecificationAttribute.basis_options
                              FILTER optionCode.id == attribute.basis_option_id
                              RETURN optionCode.option_code
    )
    RETURN {
      variant: CONCAT_SEPARATOR('; ', options),
      productCode: CONCAT_SEPARATOR(', ', UNIQUE(productCode)),
    }
  )`;
  private brandQuery = `pp.custom_product == true ? FIRST(
    FOR cr IN custom_resources
    FILTER cr.id == product.company_id
    FILTER cr.deleted_at == null
    FOR loc IN locations
    FILTER loc.id == cr.location_id
    RETURN {
      id: cr.id,
      name: loc.business_name,
      contacts: cr.contacts,
      location: KEEP(loc, 'id', ${locationRepository.basicAttributesQuery}, 'general_phone', 'general_email') }
  ) : FIRST(
    FOR b IN brands
    FILTER b.id == product.brand_id
    FILTER b.deleted_at == null
    RETURN KEEP(b, 'id', 'name', 'logo')
  )`;
  private concatProductQuery = (distributorSpecified: boolean = false) => {
    return `LET product = pp.custom_product == true ? FIRST(
      FOR product IN custom_products
      FILTER product.id == pp.product_id
      FILTER product.deleted_at == null

      LET availability = FIRST(
        FOR custom_product IN custom_products
          FILTER custom_product.id == pp.product_id
          FOR custom_resource IN custom_resources
            FILTER custom_resource.deleted_at == null
            FILTER custom_resource.id == custom_product.company_id

        LET availability = pp.distributor_location_id ? FIRST(
          RETURN pp.distributor_location_id IN custom_resource.associate_resource_ids ? ${
            Availability.Available
          } : ${Availability.Discrepancy}
        ) : FIRST(
          RETURN COUNT(custom_resource.associate_resource_ids) > 0 ? ${
            Availability.Available
          } : ${Availability.Discrepancy}
        )
        RETURN availability
      )

      RETURN MERGE(product, {availability: availability})
    ) : FIRST(
      FOR product IN products
            FILTER product.id == pp.product_id
            FILTER product.deleted_at == null

        FOR project IN projects
            FILTER project.deleted_at == null
            FILTER project.id == pp.project_id
        FOR project_location in locations
            FILTER project_location.deleted_at == null
            FILTER project_location.id == project.location_id
        ///
        LET authorized_countries = (
            FOR distributor IN distributors
                FILTER distributor.deleted_at == null
                FILTER distributor.brand_id == product.brand_id
                FOR country IN countries
                    FILTER country.deleted_at == null
                    FILTER country.id in distributor.authorized_country_ids
            RETURN DISTINCT {
                id: country.id
            }
        )
        LET market_availability = FIRST(
            FOR availability IN market_availabilities
              FILTER availability.collection_id == product.collection_id
              FILTER availability.deleted_at == null
              LET country = FIRST(
                  FOR authorized_country IN authorized_countries
                  FILTER authorized_country.id == project_location.country_id
                  ${
                    distributorSpecified
                      ? "FILTER authorized_country.id == pp.distributor_location_id"
                      : ""
                  }
                  LET c = FIRST(availability.countries[* FILTER CURRENT.id == authorized_country.id])
                  RETURN {
                      id: authorized_country.id,
                      available: c ? c.available : true
                  }
              )
            RETURN country
        )
      LET availability = market_availability ? (
        market_availability.available ? ${Availability.Available} : ${
      Availability.Discrepancy
    }
      ) : ${Availability.Discrepancy}

      RETURN MERGE(product, { availability })
    )
    FILTER product != null
    `;
  };

  public findWithRelation = async (
    projectProductId: string,
    relationId: string
  ) => {
    return (await this.model
      .select("project_products.*")
      .join("projects", "projects.id", "==", "project_products.project_id")
      .where("project_products.id", "==", projectProductId)
      .where("projects.design_id", "==", relationId)
      .first()) as ProjectProductAttributes | undefined;
  };

  public async upsert(
    payload: AssignProductToProjectRequest & { project_tracking_id: string },
    user_id: string
  ): Promise<ProjectProductAttributes[]> {
    const now = new Date();
    return this.model.rawQueryV2(
      `UPSERT {product_id: @product_id, project_id: @project_id, deleted_at: null}
      INSERT @payloadWithId
      UPDATE @payload
      IN project_products
      RETURN NEW
    `,
      {
        product_id: payload.product_id,
        project_id: payload.project_id,
        payloadWithId: {
          ...payload,
          id: uuidv4(),
          consider_status: ProductConsiderStatus.Considered,
          status: ProjectProductStatus.consider,
          created_by: user_id,
          created_at: now,
          updated_at: now,
        },
        payload: { ...payload, updated_at: now },
      }
    );
  }

  public async getListAssignedProject(project_id: string, product_id: string) {
    return this.findBy({ project_id, product_id });
  }

  public getConsideredProductsByProject = async (
    projectId: string,
    userId: string,
    zone_order: SortOrder | undefined,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder | undefined,
    specified: boolean = false
  ) => {
    const params = {
      projectId,
      userId,
      considerStatus: specified
        ? ProjectProductStatus.specify
        : ProjectProductStatus.consider,
      unlistedStatus: specified
        ? ProductSpecifyStatus.Cancelled
        : ProductConsiderStatus.Unlisted,
      specified,
      specifiedStatusKey: specified ? "specified_status" : "consider_status",
      defaultSpec: DEFAULT_USER_SPEC_SELECTION,
    };
    const rawQuery = `
      LET projectProducts = (
        FOR pp IN project_products
        FILTER pp.project_id == @projectId
        && pp.deleted_at == null
        && pp.status == @considerStatus

        ${this.concatProductQuery()}

        LET brand = ${this.brandQuery}

        LET collection = FIRST(
          FOR collection IN collections
          FILTER collection.id == product.collection_id
          FILTER collection.deleted_at == null
          RETURN KEEP(collection, 'id', 'name')
        )

        LET user = FIRST(
          FOR u IN users
          FILTER u.id == pp.created_by
          FILTER u.deleted_at == null
          RETURN u
        )

        LET productSpecification = FIRST(
          FOR spec IN user_product_specifications
          FILTER spec.user_id == @userId
          FILTER spec.product_id == pp.product_id
          FILTER spec.deleted_at == null
          RETURN KEEP(spec, 'specification', 'brand_location_id', 'distributor_location_id')
        )

        LET material_code = @specified == true ? FIRST(
          FOR material_codes IN material_codes
          FILTER material_codes.design_id == user.relation_id
          FILTER material_codes.deleted_at == null
          FOR sub IN material_codes.subs
            FOR code IN sub.codes
            FILTER code.id == pp.material_code_id
            RETURN code.code
        ) : ''

        RETURN MERGE(
          KEEP(product, 'id', 'name', 'description', 'brand_id', 'collection_id', 'images', 'dimension_and_weight', 'feature_attribute_groups', 'availability'),
          {
            brand,
            collection,
            specifiedDetail: MERGE(
              UNSET(pp, ['_id', '_key', '_rev', 'deleted_at']),
              productSpecification ? productSpecification : {
                specification: @defaultSpec,
                brand_location_id: '',
                distributor_location_id: '',
              },
              {material_code}
            ),
            assigned_name: user.lastname ? CONCAT(user.firstname, ' ', user.lastname) : user.firstname,
          }
        )
      )

      LET entireProjectProducts = (
          FOR pp IN projectProducts
          FILTER pp.specifiedDetail.entire_allocation == true
          SORT ${
            brand_order
              ? "pp.brand.name " + brand_order
              : ""
          }
          RETURN pp
      )

      LET zoneAssignedProducts = (
        FOR zone IN project_zones
        FILTER zone.project_id == @projectId
        LET areas = (
          FOR area IN zone.areas
          LET rooms = (
            FOR room IN area.rooms
            LET products = (
              FOR pp IN projectProducts
              FILTER room.id IN pp.specifiedDetail.allocation

              SORT ${
                brand_order
                  ? "pp.brand.name " + brand_order
                  : "pp.specifiedDetail.updated_at DESC"
              }
              RETURN pp
            )

            SORT room.room_name ${room_order}
            RETURN MERGE(
              room,
              { products, count: LENGTH(products) }
            )
          )

          SORT area.name ${area_order}
          RETURN MERGE(
            KEEP(area, 'id', 'name'),
            { rooms, count: COUNT(
              FOR room IN rooms
              FOR p IN room.products
              RETURN DISTINCT p.id) }
          )
        )

        SORT ${zone_order ? "zone.name " + zone_order : "zone.updated_at DESC"}
        RETURN MERGE(
          KEEP(zone, 'id', 'name'),
          { areas, count: COUNT(
              FOR area IN areas
              FOR room IN area.rooms
              FOR p IN room.products
              RETURN DISTINCT p.id) }
        )
      )

      LET data = UNION([{
        id: 'entire_project',
        name: "ENTIRE PROJECT",
        products: entireProjectProducts,
        count: LENGTH(entireProjectProducts),
      }], zoneAssignedProducts)

      LET unlistedCount = FIRST(
        FOR pp IN projectProducts
        FILTER pp.specifiedDetail.@specifiedStatusKey == @unlistedStatus
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET availabilityRemarkCount = FIRST(
        FOR projectProduct in projectProducts
        FILTER projectProduct.availability != ${Availability.Available}
        COLLECT WITH COUNT INTO length RETURN length
      )

      RETURN {
        data,
        summary: [
          {
            name:  @specified == true ? "Specified" : "Considered",
            value: LENGTH(projectProducts) - unlistedCount
          },
          {
            name:  @specified == true ? "Cancelled" : "Unlisted",
            value: unlistedCount
          },
          {
            name: "Availability Remark",
            value: availabilityRemarkCount,
            position: ${SummaryItemPosition.Left}
          }
        ]
      }
    `;
    const results = await this.model.rawQueryV2(rawQuery, params);
    return results[0];
  };

  public getSpecifiedProductsForBrandGroup = async (
    projectId: string,
    brand_order?: SortOrder
  ) => {
    const params = {
      projectId,
      specifiedStatus: ProjectProductStatus.specify,
    };
    const rawQuery = `
    LET productsByBrand = (
      FOR pp IN project_products
      FILTER pp.project_id == @projectId
      FILTER pp.status == @specifiedStatus
      FILTER pp.deleted_at == null

      ${this.concatProductQuery()}

      LET brand = ${this.brandQuery}

      FOR col IN collections
      FILTER col.id == product.collection_id
      FILTER col.deleted_at == null

      LET basisOptions = ${this.basicOptionQuery}

      COLLECT id = brand.id, name = brand.name INTO products
      RETURN { id, name, products }
    )

    FOR brand IN productsByBrand
    ${brand_order ? `SORT brand.name ${brand_order}` : ""}

    LET products = (
      FOR pro IN brand.products

      LET variant = (FOR bo IN pro.basisOptions RETURN bo.variant)
      LET productCode = (FOR bo IN pro.basisOptions RETURN DISTINCT bo.productCode==''?'N/A':bo.productCode)

      RETURN MERGE(
        UNSET(pro.product, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
        {
          brand: UNSET(pro.brand, ['_id', '_key', '_rev', 'deleted_at']),
          collection: UNSET(pro.col, ['_id', '_key', '_rev', 'deleted_at']),
          collection_name: pro.collection.name,
          specifiedDetail: UNSET(pro.pp, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
          product_id: CONCAT_SEPARATOR(' - ', productCode) == '' ? 'N/A' : CONCAT_SEPARATOR(' - ', productCode),
          variant: LENGTH(variant) > 0 ? CONCAT_SEPARATOR('; ', variant) : "Refer to Design Document"
        }
      )
    )

    RETURN {
      id: brand.id,
      name: brand.name,
      products,
      count: LENGTH(brand.products),
    }
  `;
    return this.model.rawQueryV2(rawQuery, params);
  };

  public getSpecifiedProductsForMaterial = async (
    userId: string,
    projectId: string,
    brand_order?: SortOrder,
    material_code_order?: SortOrder
  ) => {
    return this.model.rawQueryV2(
      `
      FOR pp IN project_products
      FILTER pp.status == @status
      FILTER pp.project_id == @projectId
      FILTER pp.deleted_at == null

      ${this.concatProductQuery()}

      LET brand = ${this.brandQuery}

      FOR collections IN collections
      FILTER collections.id == product.collection_id
      FILTER collections.deleted_at == null
      FOR users IN users
      FILTER users.id == @userId
      FILTER users.deleted_at == null
      LET unit_type = FIRST(
        FOR common_types IN common_types
        FILTER common_types.id == pp.unit_type_id
        FILTER common_types.deleted_at == null
        RETURN common_types
      )
      LET material_code = FIRST(
      FOR material_codes IN material_codes
      FILTER material_codes.design_id == users.relation_id
      FILTER material_codes.deleted_at == null
        FOR sub IN material_codes.subs
          FOR code IN sub.codes
          FILTER code.id == pp.material_code_id
          RETURN code
      )
      ${
        brand_order || material_code_order
          ? `SORT ${brand_order ? "brand.name " + brand_order : ""} ${
              material_code_order
                ? "code.description " + material_code_order
                : ""
            }`
          : ""
      }
      RETURN {
        project_products: UNSET(pp, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
        product: KEEP(product, 'id', 'name', 'images', 'description', 'availability'),
        brand: KEEP(brand, 'id', 'name', 'logo'),
        collection: KEEP(collections, 'id', 'name'),
        material_code,
        unit_type
      }
      `,
      {
        status: ProjectProductStatus.specify,
        userId,
        projectId,
      }
    );
  };

  public getProductBrandById = (id: string): Promise<BrandAttributes[]> => {
    return this.model.rawQuery(
      `
      FILTER project_products.id == @id
      FILTER project_products.deleted_at == null
      FOR p in products
      FILTER p.id == project_products.product_id
      FOR b IN brands
      FILTER b.id == p.brand_id
      RETURN b
    `,
      { id }
    );
  };

  public getRoomDataByRoomIds = async (id: string, roomIds: string[]) => {
    const params = { id, roomIds };
    return (await this.model.rawQuery(
      `
      FILTER project_products.id == @id
      FILTER project_products.deleted_at == null
      FOR project IN projects
      FILTER project.deleted_at == null
      FILTER project.id == project_products.project_id
          FOR project_zone IN project_zones
              FOR area IN project_zone.areas
                  FOR room IN area.rooms
                      FILTER room.id IN @roomIds
                        RETURN room
    `,
      params
    )) as IProjectZoneAttributes["areas"][0]["rooms"];
  };

  public getWithBrandAndDistributorInfo = (projectId: string) => {
    const specifyStatuses = [
      ProductSpecifyStatus["Specified"],
      ProductSpecifyStatus["Re-specified"],
    ];

    return this.model.rawQueryV2(
      `
      FOR project_products IN project_products
          FILTER project_products.deleted_at == null
          FILTER project_products.project_id == @projectId
          FILTER project_products.specified_status IN @specifyStatuses
          SORT project_products._key DESC


        LET inventory = project_products.custom_product ? FIRST(
            FOR product IN custom_products
                FILTER product.id == project_products.product_id
                FILTER product.deleted_at == null

            LET selectedOptions = (
                FILTER project_products.specification != null
                FILTER project_products.specification.attribute_groups != null
                FOR specification IN project_products.specification.attribute_groups
                    FOR attribute IN specification.attributes
                        FOR option in product.options
                            FILTER option.id == specification.id
                            FOR item IN option.items
                                FILTER item.id == attribute.basis_option_id
                                    RETURN item
            )

            LET options = (
                FOR option IN selectedOptions
                RETURN option.description
            )

            LET skus = (
                FOR option IN selectedOptions
                RETURN option.product_id == ''? 'N/A': option.product_id
            )

            LET location = FIRST(
                FOR location IN locations
                    FILTER location.id == project_products.brand_location_id
                    FILTER location.deleted_at == null
                    FOR custom_resource IN custom_resources
                        FILTER custom_resource.location_id == location.id
                        FILTER custom_resource.deleted_at == null
                    RETURN MERGE(
                    custom_resource,
                    UNSET(location, 'id'),
                    {
                        contact: LENGTH(custom_resource.contacts) > 0 ? FIRST(custom_resource.contacts) : {
                            first_name: 'N/A',
                            last_name: 'N/A',
                            position: 'N/A',
                            work_email: 'N/A',
                            work_phone: 'N/A',
                            work_mobile: 'N/A',
                        }
                    }
                )
            )

            LET distributor = FIRST(
                FOR custom_resource IN custom_resources
                    FILTER custom_resource.id == project_products.distributor_location_id
                    FILTER custom_resource.deleted_at == null
                    FOR locationAddress IN locations
                        FILTER locationAddress.id == custom_resource.location_id
                        FILTER locationAddress.deleted_at == null
                    RETURN MERGE(
                        custom_resource,
                        UNSET(locationAddress, 'id'),
                        {
                            name: locationAddress.business_name,
                            contact: LENGTH(custom_resource.contacts) > 0 ? FIRST(custom_resource.contacts) : {
                                first_name: 'N/A',
                                last_name: 'N/A',
                                position: 'N/A',
                                work_email: 'N/A',
                                work_phone: 'N/A',
                                work_mobile: 'N/A',
                            }
                        }
                    )
            )


            FOR collection IN collections
                FILTER collection.id == product.collection_id
                FILTER collection.deleted_at == null

            RETURN {
                product: MERGE(product, {
                    category_ids: ['CP'],
                    categories: [{id:'CP', name: 'Custom Library & Resource'}],
                    brand: {
                        id: location.id,
                        name: location.business_name
                    },
                    collection: collection,
                    skus: skus,
                    sku_text: CONCAT_SEPARATOR(' - ', skus) == ''?'N/A': CONCAT_SEPARATOR(' - ', skus),
                }),
                distributor: distributor,
                location: location,
                options: options,
            }

        ) : FIRST(
            FOR product IN products
                FILTER product.id == project_products.product_id
                FILTER product.deleted_at == null

            LET options = (
              FILTER project_products.specification != null && project_products.specification.attribute_groups != null
              FOR specification IN project_products.specification.attribute_groups
              FILTER specification.attributes != null
              FOR specAttribute IN specification.attributes
                FOR attributes IN attributes
                FILTER attributes.subs != null
                FOR attr IN attributes.subs
                FILTER attr.id == specAttribute.id
                  FOR basis IN bases
                  FILTER basis.subs != null
                  FOR basicAttr IN basis.subs
                  FILTER basicAttr.id == attr.basis_id && basicAttr.subs != null
                    FOR option IN basicAttr.subs
                    FILTER option.id == specAttribute.basis_option_id
              RETURN CONCAT(attr.name, ': ', option.value_1, ' ', option.unit_1,
                ' - ', option.value_2, ' ', option.unit_2)
            )

            LET skus = (
              FILTER project_products.specification != null && project_products.specification.attribute_groups != null
              FOR specification IN project_products.specification.attribute_groups
                  FOR productSpecification IN product.specification_attribute_groups
                      FILTER specification.id == productSpecification.id
                      FILTER specification.attributes != null
                      FOR attribute IN specification.attributes
                      FILTER productSpecification.attributes != null
                          FOR productSpecificationAttribute IN productSpecification.attributes
                              FILTER productSpecificationAttribute.type == 'Options'
                              FILTER attribute.id == productSpecificationAttribute.id
                              FILTER productSpecificationAttribute.basis_options != null
                                  FOR optionCode IN productSpecificationAttribute.basis_options
                                      FILTER optionCode.id == attribute.basis_option_id
                                      RETURN optionCode.option_code == ''?'N/A':optionCode.option_code
            )

            FOR brand IN brands
                FILTER brand.id == product.brand_id
                FILTER brand.deleted_at == null

            LET location = FIRST(
                FOR location IN locations
                    FILTER location.id == project_products.brand_location_id
                    FILTER location.deleted_at == null
                LET contacts = (
                    FOR user IN users
                        FILTER location.id == user.location_id
                        FILTER location.deleted_at == null
                        FILTER user.status == @userActiveStatus
                        FILTER user.department_id IN (
                            FOR common_type IN common_types
                                FILTER common_type.type == @departmentType
                                FILTER common_type.name IN ['Client/Customer Service', 'Marketing & Sales', 'Operation & Project Management']
                            RETURN common_type
                        )
                        RETURN {
                            first_name: user.firstname,
                            last_name: user.lastname,
                            position: user.position,
                            work_email: user.email,
                            work_phone: user.phone,
                            work_mobile: user.mobile,
                        }
                )
                RETURN MERGE(
                    location,
                    {
                        contact: LENGTH(contacts) > 0 ? FIRST(contacts) : {
                            first_name: 'N/A',
                            last_name: 'N/A',
                            position: 'N/A',
                            work_email: 'N/A',
                            work_phone: 'N/A',
                            work_mobile: 'N/A',
                        }
                    }
                )
            )

            LET distributor = FIRST(
                FOR distributor IN distributors
                    FILTER distributor.deleted_at == null
                    FILTER distributor.id == project_products.distributor_location_id
                    FOR distributorLocation IN locations
                      FILTER distributorLocation.id == distributor.location_id
                      FILTER distributorLocation.deleted_at == null
                RETURN MERGE(
                    distributor,
                    UNSET(distributorLocation, 'id'),
                    {
                        contact: {
                            first_name: distributor.first_name,
                            last_name: distributor.last_name,
                            position: 'Contact',
                            work_email: distributor.email,
                            work_phone: distributor.phone,
                            work_mobile: distributor.mobile,
                        }
                    }
                )
            )

            LET categories = (
                FOR mainCategory IN categories
                FILTER mainCategory.deleted_at == null
                    FOR subCategory IN mainCategory.subs
                        FOR category IN subCategory.subs
                            FOR categoryId IN product.category_ids
                            FILTER categoryId == category.id
                RETURN category
            )

            FOR collection IN collections
                FILTER collection.id == product.collection_id
                FILTER collection.deleted_at == null

            RETURN {
                product: MERGE(product, {
                    categories: categories,
                    brand: brand,
                    collection: collection,
                    skus: skus,
                    sku_text: CONCAT_SEPARATOR(' - ', skus) == ''?'N/A': CONCAT_SEPARATOR(' - ', skus),
                }),
                distributor: distributor,
                location: location,
                options: options,
            }
        )
        FILTER inventory.product != null
        FILTER inventory.distributor != null
        FILTER inventory.location != null

        LET productDimensionWeight = FIRST(
            LET dimensionWeights = (
                FILTER inventory.product.dimension_and_weight != null
                FILTER inventory.product.dimension_and_weight.attributes != null
                LET attributeDimensionWeights = inventory.product.dimension_and_weight.with_diameter ? (
                    FOR defaultAttribute IN @defaultDimensionWeight
                        FILTER defaultAttribute.with_diameter == true OR defaultAttribute.with_diameter == null
                    RETURN defaultAttribute
                ) : (
                    FOR defaultAttribute IN @defaultDimensionWeight
                        FILTER defaultAttribute.with_diameter == false OR defaultAttribute.with_diameter == null
                    RETURN defaultAttribute
                )
                FOR attribute IN inventory.product.dimension_and_weight.attributes
                    FOR attributeDimensionWeight IN attributeDimensionWeights
                        FILTER attribute.id == attributeDimensionWeight.id
                        FILTER attribute.conversion_value_1 != ""
                        RETURN {
                            unit_1: attributeDimensionWeight.conversion.unit_1,
                            value_1: attribute.conversion_value_1,
                            unit_2: attributeDimensionWeight.conversion.unit_2,
                            value_2: attribute.conversion_value_1 / attributeDimensionWeight.conversion.formula_1,
                            prefix: UPPER(LEFT(LAST(SPLIT(attributeDimensionWeight.name, " ")), 1)),
                            attributeDimensionWeight,
                            conversion: attributeDimensionWeight.conversion
                        }
            )
            RETURN dimensionWeights
        )

        FOR material_code IN material_codes
        FILTER material_code.deleted_at == null
        FOR sub IN material_code.subs
          FOR code IN sub.codes
            FILTER code.id == project_products.material_code_id

        LET unitType = FIRST(
          FOR common_type IN common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id == project_products.unit_type_id
          RETURN common_type.name
        )

        LET requirementTypes = (
          FOR common_type IN common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id IN project_products.requirement_type_ids
          RETURN common_type.name
        )

        LET instructionTypes = (
          FOR common_type IN common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id IN project_products.instruction_type_ids
          RETURN common_type.name
        )

        LET finish_schedules = (
            FOR finish_schedule IN project_product_finish_schedules
                FILTER finish_schedule.deleted_at == null
                FILTER finish_schedule.project_product_id == project_products.id
                FILTER finish_schedule.room_id IN project_products.allocation OR finish_schedule.room_id == ""
                LET rooms = (
                    FOR zone IN project_zones
                        FILTER zone.deleted_at == null
                        FOR area IN zone.areas
                            FOR room IN area.rooms
                                FILTER finish_schedule.room_id == room.id
                    RETURN room
                )


            RETURN merge(
                finish_schedule,
                {
                    room_uuid: rooms[0].id || 'EP',
                    room_id: rooms[0].room_id || 'EP',
                    room_name: rooms[0].room_name || 'ENTIRE PROJECT',
                    room_size: rooms[0].room_size || 'N/A',
                    quantity: rooms[0].quantity  || 'N/A',
                    sub_total: rooms[0].sub_total  || 'N/A',
                }
            )
        )

        RETURN merge(
          project_products,
          {
            specified_date: DATE_FORMAT(project_products.updated_at, '%yyyy-%mm-%dd'),
            location: inventory.location,
            distributor: inventory.distributor,
            product: MERGE(inventory.product, {
                dimension_and_weight: productDimensionWeight
            }),
            options: inventory.options,
            productImage: CONCAT('${ENVIRONMENT.SPACES_ENDPOINT}/${ENVIRONMENT.SPACES_BUCKET}', FIRST(inventory.product.images)),
            material_code: code,
            master_material_code_name: CONCAT(material_code.name, '/', sub.name),
            unitType: unitType,
            requirementTypes: requirementTypes,
            instructionTypes: instructionTypes,
            finish_schedules: finish_schedules,
          }
        )`,

      {
        projectId,
        specifyStatuses,
        userActiveStatus: UserStatus.Active,
        departmentType: COMMON_TYPES.DEPARTMENT,
        defaultDimensionWeight:
          getDefaultDimensionAndWeightAttribute().attributes,
      }
    );
  };
}
export const projectProductRepository = new ProjectProductRepository();

export default ProjectProductRepository;
