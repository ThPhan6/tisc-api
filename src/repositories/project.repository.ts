import { ProjectAttributes, SortOrder } from "@/types";
import BaseRepository from "@/repositories/base.repository";
import ProjectModel from "@/model/project.model";
import { forEach, isNumber } from "lodash";

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
}

export const projectRepository = new ProjectRepository();

export default ProjectRepository;
