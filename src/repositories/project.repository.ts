import { ProjectAttributes, ProjectStatus, SortOrder } from "@/types";
import BaseRepository from "@/repositories/base.repository";
import ProjectModel from "@/model/project.model";
import { forEach, isNumber } from "lodash";
import {
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
} from "@/api/project_product/project_product.type";

class ProjectRepository extends BaseRepository<ProjectAttributes> {
  protected model: ProjectModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectAttributes> = {
    code: "",
    name: "",
    location: "",
    country_id: "",
    state_id: "",
    city_id: "",
    country_name: "",
    state_name: "",
    city_name: "",
    address: "",
    phone_code: "",
    postal_code: "",
    project_type_id: "",
    project_type: "",
    building_type_id: "",
    building_type: "",
    measurement_unit: 1,
    design_due: "",
    construction_start: "",
    team_profile_ids: [],

    product_ids: [],

    design_id: "",
    status: 0,
    created_at: "",
  };

  constructor() {
    super();
    this.model = new ProjectModel();
  }

  public async getListProject(
    designId: string,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder,
    filter: any
  ) {
    const params = {
      design_id: designId,
      offset,
      limit,
    };
    const rawQuery = `
    FILTER projects.deleted_at == null
    FILTER projects.design_id == @design_id
    ${
      isNumber(filter?.status)
        ? `FILTER projects.status == ${filter.status}`
        : ""
    }
    LET users = (
        FOR users in users
        FILTER users.deleted_at == null
        FOR teamIds in projects.team_profile_ids
        FILTER users.id == teamIds
        RETURN KEEP(users, 'id', 'firstname', 'lastname', 'avatar')
    )

    ${sort ? `SORT projects.${sort} ${order} ` : ``}
    LIMIT @offset, @limit
    RETURN MERGE(
      KEEP(
        projects,
        'id','code','name','location','project_type',
        'building_type','design_due','design_id','status','created_at'
      ),
      {assign_teams: users}
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

  public async findProjectWithDesignData(id: string) {
    return (await this.model
      .select(
        "projects.*",
        "designers.name as design_firm_name",
        "designers.official_website as design_firm_official_website"
      )
      .join("designers", "designers.id", "==", "projects.design_id")
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
    space: {
      metric: number;
      imperial: number;
    };
  }> {
    const overallSummary = await this.model.rawQueryV2(
      `
      LET allProjects = (
        FOR prj IN projects
        FILTER prj.deleted_at == null
        RETURN KEEP(prj, 'id', 'status', 'country_id', 'measurement_unit')
      )

      LET countries = (
        FOR c IN countries
        FOR prj IN allProjects
        FILTER c.deleted_at == null
        FILTER c.id == prj.country_id
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
        FOR p IN prjProducts
        RETURN DISTINCT p.product_id
      )

      LET space = (
        FOR prj IN allProjects
        FOR z IN project_zones
        FILTER z.project_id == prj.id
        COLLECT unit = prj.measurement_unit == 2 ? 'metric' : 'imperial'
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
        space: {
          metric,
          imperial,
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
      }
    );
    return overallSummary[0];
  }
}

export const projectRepository = new ProjectRepository();

export default ProjectRepository;
