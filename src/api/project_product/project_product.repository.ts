import ProjectProductModel, {
  ProjectProductAttributes,
} from "@/api/project_product/project_product.model";
import BaseRepository from "@/repositories/base.repository";
import {
  AssignProductToProjectRequest,
  OrderMethod,
  ProductConsiderStatus,
  ProjectProductStatus,
} from "./project_product.type";
import { v4 as uuidv4 } from "uuid";
import {uniqBy} from 'lodash';
import {ENVIROMENT} from '@/config';
import { BrandAttributes, SortOrder, IProjectZoneAttributes } from "@/types";

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
    userId: string
  ) => {
    const params = {
      projectId,
      userId,
      considerStatus: ProjectProductStatus.consider,
    };
    const rawQuery = `
    FILTER project_products.project_id == @projectId
    FILTER project_products.deleted_at == null
    FILTER project_products.status == @considerStatus

    FOR products IN products
    FILTER products.id == project_products.product_id

    LET brands = (
      FOR brands IN brands
      FILTER brands.id == products.brand_id
      RETURN brands
    )

    LET collections = (
      FOR collections IN collections
      FILTER collections.id == products.collection_id
      RETURN collections
    )

    LET users = (
      FOR users IN users
      FILTER users.id == project_products.created_by
      RETURN users
    )

    LET user_product_specifications = (
      FOR user_product_specifications IN user_product_specifications
      FILTER user_product_specifications.user_id == @userId
      FILTER user_product_specifications.product_id == project_products.product_id
      RETURN user_product_specifications
    )

    RETURN MERGE(project_products, {
      products,
      brands: brands[0],
      collections: collections[0],
      user_product_specifications: user_product_specifications[0],
      users: users[0],
      user_product_specification: user_product_specifications
    })
    `;
    return this.model.rawQuery(rawQuery, params);
  };

  public getSpecifiedProductsForBrandGroup = async (project_id: string) => {
    return this.model
      .getQuery()
      .where("project_id", "==", project_id)
      .where("status", "==", ProjectProductStatus.specify)
      .join("products", "products.id", "==", "project_products.product_id")
      .join("brands", "brands.id", "==", "products.brand_id")
      .join("collections", "collections.id", "==", "products.collection_id")
      .get(true);
  };

  public getSpecifiedProductsForMaterial = async (
    userId: string,
    projectId: string,
    brand_order?: SortOrder,
    material_code_order?: SortOrder
  ) => {
    return this.model.rawQuery(
      `
      FILTER project_products.status == @status
      FILTER project_products.project_id == @projectId
      FILTER project_products.deleted_at == null
      FOR products IN products
      FILTER products.id == project_products.product_id
      FOR brands IN brands
      FILTER brands.id == products.brand_id
      FOR collections IN collections
      FILTER collections.id == products.collection_id
      FOR users IN users
      FILTER users.id == @userId
      LET unit_type = (
        FOR common_types IN common_types
        FILTER common_types.id == project_products.unit_type_id
        RETURN common_types
      )
      LET code = (
      FOR material_codes IN material_codes
      FILTER material_codes.design_id == users.relation_id
          FOR sub IN material_codes.subs
              FOR code IN sub.codes
              FILTER code.id == project_products.material_code_id
              RETURN code
      )
      ${
        brand_order || material_code_order
          ? `SORT ${brand_order ? "brands.name " + brand_order : ""} ${
              material_code_order
                ? "code[0].description " + material_code_order
                : ""
            }`
          : ""
      }
      RETURN {
        project_products: UNSET(project_products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
        product: KEEP(products, 'id', 'name', 'images', 'description'),
        brand: KEEP(brands, 'id', 'name', 'logo'),
        collection: KEEP(collections, 'id', 'name'),
        material_code: code[0],
        unit_type: unit_type[0]
      }
      `,
      {
        status: ProjectProductStatus.specify,
        userId,
        projectId,
      }
    );
  };
  public getSpecifiedProductsForZoneGroup = async (
    userId: string,
    projectId: string
  ) => {
    return this.model.rawQuery(
      `
    FILTER project_products.status == @status
    FILTER project_products.project_id == @projectId
    FILTER project_products.deleted_at == null
    FOR products IN products
    FILTER products.id == project_products.product_id
    FOR brands IN brands
    FILTER brands.id == products.brand_id
    FOR collections IN collections
    FILTER collections.id == products.collection_id
    FOR users IN users
    FILTER users.id == @userId
    LET code = (
    FOR material_codes IN material_codes
    FILTER material_codes.design_id == users.relation_id
        FOR sub IN material_codes.subs
            FOR code IN sub.codes
            FILTER code.id == project_products.material_code_id
            RETURN code
    )
    RETURN {
      project_products: UNSET(project_products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']),
      product: KEEP(products, 'id', 'name', 'images', 'description'),
      brand: KEEP(brands, 'id', 'name', 'logo'),
      collection: KEEP(collections, 'id', 'name'),
      material_code: code[0]
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
    return this.model.rawQueryV2(
      `
        FOR project_products IN project_products
          FOR location IN locations
            FILTER location.id == project_products.brand_location_id
          FILTER location.deleted_at == null
        FOR distributor IN distributors
          FILTER distributor.id == project_products.distributor_location_id
          FILTER distributor.deleted_at == null
        FOR products IN products FILTER products.id == project_products.product_id
          FILTER products.deleted_at == null
          FILTER project_products.deleted_at == null
          FILTER project_products.project_id == @projectId
        SORT project_products._key DESC

        FOR collection IN collections
            filter collection.id == products.collection_id
            filter collection.deleted_at == null

        FOR brand IN brands
            filter brand.id == products.brand_id
            filter brand.deleted_at == null

        FOR material_code IN material_codes
        FILTER material_code.deleted_at == null
        FOR sub IN material_code.subs
          FOR code IN sub.codes
            FILTER code.id == project_products.material_code_id

        LET categories = (
            FOR mainCategory IN categories
                FOR subCategory IN mainCategory.subs
                    FOR category IN subCategory.subs
                        FOR categoryId IN products.category_ids
                        FILTER categoryId == category.id
            RETURN category
        )

        LET options = (
          FILTER project_products.specification != null
          FILTER project_products.specification.attribute_groups != null
          FOR specification IN project_products.specification.attribute_groups
            FOR attribute IN specification.attributes
            FOR basis IN bases
              FOR subBasis IN basis.subs
              FILTER subBasis.subs != null
              FOR option IN subBasis.subs
                FILTER option.id == attribute.basis_option_id
                  RETURN CONCAT(subBasis.name, ': ', option.value_1, ' ', option.unit_1, ' ', option.value_2, ' ', option.unit_2)
        )

        LET unitTypes = (
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
            specified_date: DATE_FORMAT(project_products.updated_at, '%yyyy-%mm,-%dd'),
            location: location,
            distributor: distributor,
            product: merge(
                products,
                {
                  brand: brand,
                  collection: collection,
                  categories: categories,
                }
            ),
            options: options,
            productImage: CONCAT('${ENVIROMENT.SPACES_ENDPOINT}/${ENVIROMENT.SPACES_BUCKET}', products.images[0]),
            material_code: code,
            master_material_code_name: CONCAT(material_code.name, '/', sub.name),
            unitType: unitTypes[0],
            requirementTypes: requirementTypes,
            instructionTypes: instructionTypes,
            finish_schedules: finish_schedules,
          }
        )`,

      { projectId }
    );
  }

}
export const projectProductRepository = new ProjectProductRepository();

export default ProjectProductRepository;
