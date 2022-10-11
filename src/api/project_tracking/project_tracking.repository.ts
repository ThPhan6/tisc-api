import BaseRepository from "@/repositories/base.repository";
import { DesignerAttributes, ProjectAttributes, SortOrder } from "@/types";
import { v4 } from "uuid";
import {
  CreateProjectRequestBody,
  ProjectRequestAttributes,
} from "./project_request.model";
import ProjectTrackingModel, {
  ProjectTrackingAttributes,
  ProjectTrackingPriority,
} from "./project_tracking.model";
import {
  GetProjectListFilter,
  GetProjectListSort,
} from "./project_tracking.types";

class ProjectTrackingRepository extends BaseRepository<ProjectTrackingAttributes> {
  protected model: ProjectTrackingModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectTrackingAttributes> = {
    id: "",
    project_id: "",
    read_by: [],
    assigned_teams: [],
    priority: ProjectTrackingPriority.Non,
    created_at: "",
    updated_at: "",
  };

  constructor() {
    super();
    this.model = new ProjectTrackingModel();
  }

  public async findOrCreateIfNotExists(
    payload: CreateProjectRequestBody
  ): Promise<ProjectTrackingAttributes> {
    const now = new Date();
    const results = await this.model.rawQueryV2(
      `UPSERT {project_id: @project_id}
      INSERT @payloadWithId
      UPDATE {}
      IN project_trackings
      RETURN NEW
    `,
      {
        project_id: payload.project_id,
        payloadWithId: {
          ...payload,
          product_id: undefined,
          id: v4(),
          created_at: now,
          updated_at: now,
        },
      }
    );
    return results[0];
  }

  public async getListProjectTracking(
    brandId: string,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort,
    order: SortOrder
  ): Promise<
    {
      project_tracking: ProjectTrackingAttributes;
      project: ProjectAttributes;
      projectRequests: ProjectRequestAttributes[];
      designFirm: DesignerAttributes;
    }[]
  > {
    const params = {
      brandId,
      offset,
      limit,
      priority: filter.priority,
      projectStatus: filter.project_status,
    };
    const rawQuery = `
    ${
      typeof filter.priority === "number"
        ? `FILTER project_trackings.priority == @priority`
        : ""
    }
    LIMIT @offset, @limit
    ${sort === "created_at" ? `SORT project_trackings.${sort} ${order}` : ""}

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    ${
      typeof filter.project_status === "number"
        ? "FILTER projects.status == @projectStatus"
        : ""
    }
    ${sort === "project_name" ? `SORT projects.name ${order}` : ""}
    ${sort === "project_location" ? `SORT projects.location ${order}` : ""}
    ${sort === "project_type" ? `SORT projects.project_type ${order}` : ""}

    LET projectRequests = (
      FOR project_requests IN project_requests
      FILTER project_requests.project_tracking_id == project_trackings.id
      RETURN project_requests
    )
    LET requestIds = (
      FOR project_requests IN projectRequests
      RETURN project_requests.product_id
    )
    LET requestUsers = (
      FOR project_requests IN projectRequests
      RETURN project_requests.created_by
    )

    LET projectProducts = (
      FOR project_products IN project_products
      FILTER project_products.project_tracking_id == project_trackings.id
      RETURN project_products
    )
    LET projectProductIds = (
      FOR project_products IN projectProducts
      RETURN project_products.product_id
    )
    LET ppUsers = (
      FOR project_products IN projectProducts
      RETURN project_products.created_by
    )

    LET notifications = (
      FOR ptn IN project_tracking_notifications
      FILTER ptn.project_tracking_id == project_trackings.id
      RETURN ptn
    )

    LET products = (
      FOR products IN products
      FILTER (products.brand_id == @brandId) AND 
        (products.id IN requestIds OR products.id IN projectProductIds)
        RETURN products
    )

    FOR users IN users
    FILTER users.id IN requestUsers OR users.id IN ppUsers

    FOR designers IN designers
    FILTER designers.id == users.relation_id
    ${sort === "design_firm" ? `SORT designers.name ${order}` : ""}

    RETURN {
      project_tracking: UNSET(project_trackings, ['_key','_id','_rev']),
      project: projects,
      projectRequests,
      designFirm: designers,
      notifications,
      products
    }
    `;
    return this.model.rawQuery(rawQuery, params);
  }
}

export const projectTrackingRepository = new ProjectTrackingRepository();

export default ProjectTrackingRepository;
