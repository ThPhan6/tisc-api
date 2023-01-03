import {
  ILocationAttributes,
  ProjectAttributes,
  ProjectStatus,
  SortOrder,
  UserStatus,
} from "@/types";
import BaseRepository from "@/repositories/base.repository";
import ProjectModel from "@/model/project.model";
import { forEach, isNumber, pick } from "lodash";
import {
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
} from "@/api/project_product/project_product.type";
import { ProjectListingSort } from "@/api/project/project.type";
import { MEASUREMENT_UNIT, SQUARE_METER_TO_SQUARE_FOOT } from "@/constants";
import { locationRepository } from "./location.repository";
import { v4 } from "uuid";

class ProjectRepository extends BaseRepository<ProjectAttributes> {
  protected model: ProjectModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectAttributes> = {
    code: "",
    name: "",
    location_id: "",
    project_type_id: "",
    project_type: "",
    building_type_id: "",
    building_type: "",
    measurement_unit: 1,
    design_due: "",
    construction_start: "",
    team_profile_ids: [],

    design_id: "",
    status: 0,
  };

  constructor() {
    super();
    this.model = new ProjectModel();
  }

  public async syncProjectLocations() {
    const projects = await this.model.where("location_id", "==", null).get();

    if (projects.length === 0) {
      return;
    }

    const createLocationPromises = projects.map(async (el: any) => {
      const location = await locationRepository.create({
        id: v4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...pick(
          el,
          "country_id",
          "state_id",
          "city_id",
          "country_name",
          "state_name",
          "city_name",
          "phone_code",
          "address",
          "postal_code"
        ),
      });
      if (location) {
        await this.model.where("id", "==", el.id).update({
          location_id: location.id,
        });
      }
    });
    await Promise.all(createLocationPromises);
  }

  public async getListProject(
    designId: string,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder,
    filter: { status?: ProjectStatus },
    userId?: string
  ) {
    const params = {
      design_id: designId,
      offset,
      limit,
      userId,
    };

    const sortColumn = sort == "location" ? sort : `projects.${sort}`;

    const rawQuery = `
    FILTER projects.deleted_at == null
    FILTER projects.design_id == @design_id
    ${
      isNumber(filter?.status)
        ? `FILTER projects.status == ${filter.status}`
        : ""
    }
    ${userId ? "FILTER @userId IN projects.team_profile_ids" : ""}

    LET users = (
        FOR users in users
        FILTER users.deleted_at == null
        FOR teamIds in projects.team_profile_ids
        FILTER users.id == teamIds
        RETURN KEEP(users, 'id', 'firstname', 'lastname', 'avatar')
    )

    FOR loc IN locations
    FILTER loc.deleted_at == null
    FILTER loc.id == projects.location_id

    LET location = ${locationRepository.getShortLocationQuery("loc")}

    ${sort ? `SORT ${sortColumn} ${order} ` : ``}
    ${isNumber(offset) && isNumber(limit) ? "LIMIT @offset, @limit" : ""}
    RETURN MERGE(
      KEEP(
        projects,
        'id','code','name','project_type',
        'building_type','design_due','design_id','status','created_at'
      ),
      {assign_teams: users, location}
    )
    `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async countProjectBy(designId: string, filter: any) {
    if (typeof filter?.status === "number") {
      return this.model
        .where("design_id", "==", designId)
        .where("status", "==", filter.status)
        .count();
    }
    return this.model.where("design_id", "==", designId).count();
  }

  public async getAllProjectByWithSelect(
    params: {
      [key: string]: string | number | null | boolean;
    },
    keys: string[],
    order: string,
    sort: SortOrder
  ) {
    let query = this.model.getQuery();
    forEach(params, (value, column) => {
      query = query.where(column, "==", value);
    });
    return query
      .select([...keys])
      .order(order, sort)
      .get();
  }

  public async getProjectExist(id: string, code: string, designId: string) {
    return this.model
      .where("id", "!=", id)
      .where("code", "==", code)
      .where("design_id", "==", designId)
      .first();
  }

  public async getProjectWithLocation(
    id: string
  ): Promise<ProjectAttributes & { location: ILocationAttributes }> {
    const project = await this.model.rawQuery(
      `
        FILTER projects.deleted_at == null
        FILTER projects.id == @id
        FOR loc IN locations
        FILTER loc.id == projects.location_id
        RETURN MERGE(
          UNSET(projects, ['_id', '_key', '_rev', 'deleted_at']),
          {location: KEEP(loc, ${locationRepository.basicAttributesQuery})}
        )
      `,
      { id }
    );
    return project[0];
  }

  public async findProjectWithDesignData(id: string) {
    return (await this.model
      .select(
        "projects.*",
        "designers.name as design_firm_name",
        "designers.official_website as design_firm_official_website",
        "locations.country_name as country_name",
        "locations.country_id as country_id",
        "locations.state_name as state_name",
        "locations.state_id as state_id",
        "locations.city_name as city_name",
        "locations.city_id as city_id",
        "locations.address as address",
        "locations.postal_code as postal_code"
      )
      .join("designers", "designers.id", "==", "projects.design_id")
      .join("locations", "locations.id", "==", "projects.location_id")
      .where("projects.id", "==", id)
      .first()) as ProjectAttributes & {
      design_firm_name: string;
      design_firm_official_website: string;
    };
  }

  public async getOverallSummary(): Promise<{
    projects: {
      total: number;
      live: number;
      onHold: number;
      archived: number;
    };
    countries: {
      regions: string[];
      summary: {
        region: string;
        count: number;
      }[];
    };
    products: {
      total: number;
      consider: number;
      unlisted: number;
      deleted: number;
      specified: number;
      cancelled: number;
    };
    area: {
      metric: number;
      imperial: number;
    };
  }> {
    const overallSummary = await this.model.rawQueryV2(
      `
      LET allProjects = (
        FOR prj IN projects
        FILTER prj.deleted_at == null
        FOR loc IN locations
        FILTER loc.id == prj.location_id
        FILTER loc.deleted_at == null
        RETURN MERGE(
          KEEP(prj, 'id', 'status', 'measurement_unit'),
          { country_id: loc.country_id }
        )
      )

      LET countries = (
        LET uniqueCountries = (
          FOR prj IN allProjects
          FOR c IN countries
          FILTER c.deleted_at == null
          FILTER c.id == prj.country_id
          RETURN DISTINCT c
        )

        FOR c IN uniqueCountries
        COLLECT group = c.region INTO countryGroup
        RETURN {
          region: group,
          count: COUNT(countryGroup)
        }
      )

      LET regions = (
        FOR c IN countries
        FILTER c.region != ""
        FILTER c.deleted_at == null
        RETURN DISTINCT c.region
      )

      LET live = (
        FOR p IN allProjects
        FILTER p.status == @liveStatus
        COLLECT WITH COUNT INTO length RETURN length
      )
      LET onHold = (
        FOR p IN allProjects
        FILTER p.status == @onHoldStatus
        COLLECT WITH COUNT INTO length RETURN length
      )
      LET archived = (
        FOR p IN allProjects
        FILTER p.status == @archiveStatus
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET prjProducts = (
        FOR prj IN allProjects
        FOR pp IN project_products
        FILTER pp.project_id == prj.id
        FOR p IN products
        FILTER p.deleted == null
        RETURN DISTINCT KEEP(pp, 'id','product_id', 'status', 'consider_status', 'specified_status', 'deleted_at')
      )

      LET deleted = (
        FOR pp IN prjProducts
        FILTER pp.deleted_at != null
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET considerPrjProducts = (
        FOR pp IN prjProducts
        FILTER pp.status == @considerStatus
        FILTER pp.deleted_at == null
        RETURN pp
      )
      LET unlisted = (
        FOR pp IN considerPrjProducts
        FILTER pp.consider_status == @unlistedStatus
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET specifiedPrjProducts = (
        FOR pp IN prjProducts
        FILTER pp.status == @specifiedStatus
        FILTER pp.deleted_at == null
        RETURN pp
      )

      LET cancelled = (
        FOR pp IN specifiedPrjProducts
        FILTER pp.specified_status == @cancelledStatus
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET products = (
        FOR pp IN prjProducts
        FILTER pp.deleted_at == null
        RETURN pp.product_id
      )

      LET space = (
        FOR prj IN allProjects
        FOR z IN project_zones
        FILTER z.project_id == prj.id
        COLLECT unit = prj.measurement_unit == @metricUnit ? 'metric' : 'imperial'
        INTO unitGroup
        RETURN {unit, areas: FLATTEN(unitGroup[*].z.areas), prj: unitGroup[*].prj}
      )

      LET metric = SUM(
        FOR s IN space
        FILTER s.unit == 'metric'
        FOR area IN s.areas
        FOR room IN area.rooms
        RETURN room.sub_total
      )

      LET imperial = SUM(
        FOR s IN space
        FILTER s.unit == 'imperial'
        FOR area IN s.areas
        FOR room IN area.rooms
        RETURN room.sub_total
      )


      RETURN {
        projects: {
          total: LENGTH(allProjects),
          live: live[0],
          onHold: onHold[0],
          archived: archived[0]
        },
        countries: {
          summary: countries,
          regions
        },
        products: {
          total: LENGTH(products),
          deleted: deleted[0],
          consider: LENGTH(considerPrjProducts) - unlisted[0],
          unlisted: unlisted[0],
          specified: LENGTH(specifiedPrjProducts) - cancelled[0],
          cancelled: cancelled[0],
        },
        area: {
          metric: metric + imperial * (1 / @meterToFoot),
          imperial: imperial + metric * @meterToFoot,
        },
      }
    `,
      {
        liveStatus: ProjectStatus.Live,
        onHoldStatus: ProjectStatus["On Hold"],
        archiveStatus: ProjectStatus.Archived,
        considerStatus: ProjectProductStatus.consider,
        specifiedStatus: ProjectProductStatus.specify,
        unlistedStatus: ProductConsiderStatus.Unlisted,
        cancelledStatus: ProductSpecifyStatus.Cancelled,
        metricUnit: MEASUREMENT_UNIT.METRIC,
        meterToFoot: SQUARE_METER_TO_SQUARE_FOOT,
      }
    );
    return overallSummary[0];
  }

  public async getProjectSummary(
    relationId: string,
    userId?: string
  ): Promise<{ status: ProjectStatus }[]> {
    const projectSummary = await this.model.rawQuery(
      `
      FILTER projects.deleted_at == null
      FILTER projects.design_id == @relationId
        ${userId ? "FILTER @userId IN projects.team_profile_ids" : ""}
        RETURN KEEP(projects, 'status')
      `,
      { relationId, userId }
    );
    return projectSummary;
  }

  public async getProjectListing(
    limit: number,
    offset: number,
    sort: ProjectListingSort,
    order: SortOrder
  ) {
    const sortColumn = ["status", "country_name", "city_name"].includes(sort)
      ? sort
      : `prj.${sort}`;

    const rawQuery = `
      LET allProjects = (
        FOR prj IN projects
        FILTER prj.deleted_at == null
        RETURN prj
      )

      LET projects = (
        FOR prj IN allProjects
        FOR loc IN locations
        FILTER loc.deleted_at == null
        FILTER loc.id == prj.location_id

        LET prjProducts = (
          FOR pp IN project_products
          FILTER pp.project_id == prj.id
          RETURN KEEP(pp, 'id','product_id', 'status', 'consider_status', 'specified_status', 'deleted_at')
        )

        LET deleted = (
          FOR pp IN prjProducts
          FILTER pp.deleted_at != null
          RETURN DISTINCT KEEP(pp, 'product_id', 'status')
        )

        LET considerPrjProducts = (
          FOR pp IN prjProducts
          FILTER pp.status == @considerStatus
          FILTER pp.deleted_at == null
          RETURN DISTINCT pp
        )
        LET unlisted = (
          FOR pp IN considerPrjProducts
          FILTER pp.consider_status == @unlistedStatus
          COLLECT WITH COUNT INTO length RETURN length
        )

        LET specifiedPrjProducts = (
          FOR pp IN prjProducts
          FILTER pp.status == @specifiedStatus
          FILTER pp.deleted_at == null
          RETURN pp
        )

        LET cancelled = (
          FOR pp IN specifiedPrjProducts
          FILTER pp.specified_status == @cancelledStatus
          COLLECT WITH COUNT INTO length RETURN length
        )

        LET products = (
          FOR pp IN prjProducts
          FILTER pp.deleted_at == null
          RETURN pp.product_id
        )

        LET area = SUM(
          FOR z IN project_zones
          FILTER z.deleted_at == null
          FILTER z.project_id == prj.id
          FOR area IN z.areas
          FOR room IN area.rooms
          RETURN room.sub_total
        )

        LET status = prj.status == @liveStatus ? 'Live' : prj.status == @onHoldStatus ? 'On Hold' : 'Archived'
        LET city_name = loc.city_name == '' ? 'N/A' : loc.city_name
        LET country_name = loc.country_name

        SORT ${sortColumn} @order
        LIMIT @offset, @limit
        RETURN MERGE(
          KEEP(prj, 'id', 'created_at', 'name', 'project_type', 'building_type', 'country_name'),
          {
            status,
            city_name,
            country_name,
            metricArea: prj.measurement_unit == @metricUnit ? area : area * (1 / @meterToFoot),
            imperialArea: prj.measurement_unit == @metricUnit ? area * @meterToFoot : area,
            productCount: LENGTH(products),
            deleted: LENGTH(deleted),
            consider: LENGTH(considerPrjProducts) - unlisted[0],
            unlisted: unlisted[0],
            specified: LENGTH(specifiedPrjProducts) - cancelled[0],
            cancelled: cancelled[0],
          }
        )
      )

      RETURN {
        projects,
        total: LENGTH(allProjects),
      }
    `;

    return this.model.rawQueryV2(rawQuery, {
      offset,
      limit,
      order,
      liveStatus: ProjectStatus.Live,
      onHoldStatus: ProjectStatus["On Hold"],
      considerStatus: ProjectProductStatus.consider,
      specifiedStatus: ProjectProductStatus.specify,
      unlistedStatus: ProductConsiderStatus.Unlisted,
      cancelledStatus: ProductSpecifyStatus.Cancelled,
      metricUnit: MEASUREMENT_UNIT.METRIC,
      meterToFoot: SQUARE_METER_TO_SQUARE_FOOT,
    });
  }

  public async getProjectListingDetail(projectId: string) {
    const rawQuery = `
      FOR prj IN projects
      FILTER prj.id == @projectId
      FILTER prj.deleted_at == null
      FOR l IN locations
      FILTER l.deleted_at == null
      FILTER l.id == prj.location_id

      FOR d IN designers
      FILTER d.id == prj.design_id

      LET spacing = (
        FOR z IN project_zones
        FILTER z.deleted_at == null
        FILTER z.project_id == @projectId
        RETURN KEEP(z, 'id', 'name', 'areas')
      )

      LET area = SUM(
        FOR space IN spacing
        FOR area IN space.areas
        FOR room IN area.rooms
        RETURN room.sub_total
      )

      LET prjProducts = (
        FOR pp IN project_products
        FILTER pp.project_id == @projectId
        RETURN DISTINCT KEEP(pp, 'id','product_id', 'status', 'consider_status', 'specified_status', 'deleted_at')
      )

      LET considerDeleted = (
        FOR pp IN prjProducts
        FILTER pp.deleted_at != null
        FILTER pp.status == @considerStatus
        RETURN DISTINCT pp.product_id
      )
      LET specifyDeleted = (
        FOR pp IN prjProducts
        FILTER pp.deleted_at != null
        FILTER pp.status == @specifiedStatus
        RETURN DISTINCT pp.product_id
      )

      LET considerPrjProducts = (
        FOR pp IN prjProducts
        FILTER pp.status == @considerStatus
        FILTER pp.deleted_at == null
        RETURN pp
      )
      LET considerProductBrands = (
        FOR pp IN considerPrjProducts
        FOR product IN products
        FILTER product.id == pp.product_id
        FOR b IN brands
        FILTER b.id == product.brand_id
        FILTER b.deleted_at == null
        COLLECT brand = product.brand_id INTO brandGroup
        RETURN {
          name: FIRST(brandGroup[*].b.name),
          logo: FIRST(brandGroup[*].b.logo),
          products: (FOR group IN brandGroup RETURN MERGE(
            KEEP(group.product, 'id', 'brand_id', 'name'),
            { image: FIRST(group.product.images), status: group.pp.consider_status } )
          )
        }
      )
      LET considerCustomProducts = (
        FOR pp IN considerPrjProducts
        FOR p IN custom_products
        FILTER p.id == pp.product_id
        FILTER p.deleted_at == null
        RETURN MERGE(
          KEEP(p, 'id', 'company_id', 'name'),
          { image: FIRST(p.images),
            status: pp.consider_status
          }
        )
      )

      LET specifiedPrjProducts = (
        FOR pp IN prjProducts
        FILTER pp.status == @specifiedStatus
        FILTER pp.deleted_at == null
        RETURN pp
      )

      LET specifiedProductBrands = (
        FOR pp IN specifiedPrjProducts
        FOR product IN products
        FILTER product.id == pp.product_id
        FOR b IN brands
        FILTER b.id == product.brand_id
        FILTER b.deleted_at == null
        COLLECT brand = product.brand_id INTO brandGroup
        RETURN {
          name: FIRST(brandGroup[*].b.name),
          logo: FIRST(brandGroup[*].b.logo),
          products: (FOR group IN brandGroup RETURN MERGE(
            KEEP(group.product, 'id', 'brand_id', 'name'),
            { image: FIRST(group.product.images), status: group.pp.specified_status } )
          )
        }
      )
      LET specifiedCustomProducts = (
        FOR pp IN specifiedPrjProducts
        FOR p IN custom_products
        FILTER p.id == pp.product_id
        FILTER p.deleted_at == null
        RETURN MERGE(
          KEEP(p, 'id', 'company_id', 'name'),
          { image: FIRST(p.images),
            status: pp.specified_status
          }
        )
      )

      LET specifiedBrandProducts = FLATTEN(specifiedProductBrands[*].products)
      LET considerBrandProducts = FLATTEN(considerProductBrands[*].products)

      LET unlisted = (
        FOR p IN UNION(considerBrandProducts, considerCustomProducts)
        FILTER p.status == @unlistedStatus
        COLLECT WITH COUNT INTO length RETURN length
      )
      LET cancelled = (
        FOR p IN UNION(specifiedBrandProducts, specifiedCustomProducts)
        FILTER p.status == @cancelledStatus
        COLLECT WITH COUNT INTO length RETURN length
      )

      LET members = (
        FOR u IN users
        FILTER u.deleted_at == null
        FILTER u.status == @activeStatus
        FILTER u.id IN prj.team_profile_ids
        FOR loc IN locations
        FILTER loc.id == u.location_id
        FOR common_types IN common_types
        FILTER common_types.id == u.department_id
        FILTER common_types.deleted_at == null
        FOR role in roles
        FILTER role.deleted_at == null
        FILTER role.id == u.role_id
        RETURN MERGE(
          KEEP(u, 'id', 'firstname', 'lastname', 'gender', 'avatar', 'position', 'email', 'phone', 'mobile', 'status'),
          {
            department: common_types.name,
            phone_code: loc.phone_code,
            access_level: role.name,
            work_location: ${locationRepository.getFullLocationQuery("loc")}
          }
        )
      )

      RETURN {
        basic: MERGE(
          KEEP(prj, 'code', 'status', 'name', 'project_type', 'building_type', 'measurement_unit', 'design_due', 'construction_start', 'updated_at'),
          {
            address: ${locationRepository.getFullLocationQuery("l")},
            designFirm: KEEP(d, 'name', 'logo')
          }
        ),
        spacing: {
          zones: spacing,
          metricArea: prj.measurement_unit == @metricUnit ? area : area * (1 / @meterToFoot),
          imperialArea: prj.measurement_unit == @metricUnit ? area * @meterToFoot : area,
        },
        considered: {
          brands: considerProductBrands,
          customProducts: considerCustomProducts,
          deleted: LENGTH(considerDeleted),
          consider: LENGTH(considerBrandProducts) + LENGTH(considerCustomProducts) - unlisted[0],
          unlisted: unlisted[0],
        },
        specified: {
          brands: specifiedProductBrands,
          customProducts: specifiedCustomProducts,
          deleted: LENGTH(specifyDeleted),
          specified: LENGTH(specifiedBrandProducts) + LENGTH(specifiedCustomProducts) - cancelled[0],
          cancelled: cancelled[0],
        },
        members
      }
    `;

    return this.model.rawQueryV2(rawQuery, {
      projectId,
      metricUnit: MEASUREMENT_UNIT.METRIC,
      meterToFoot: SQUARE_METER_TO_SQUARE_FOOT,
      considerStatus: ProjectProductStatus.consider,
      specifiedStatus: ProjectProductStatus.specify,
      unlistedStatus: ProductConsiderStatus.Unlisted,
      cancelledStatus: ProductSpecifyStatus.Cancelled,
      activeStatus: UserStatus.Active,
    });
  }
}

export const projectRepository = new ProjectRepository();

export default ProjectRepository;
