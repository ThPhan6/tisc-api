import BaseRepository from "@/repositories/base.repository";
import {
  DesignerAttributes,
  ProjectAttributes,
  ProjectStatus,
  SortOrder,
} from "@/types";
import { v4 } from "uuid";
import {
  CreateProjectRequestBody,
  ProjectRequestAttributes,
  ProjectRequestStatus,
} from "./project_request.model";
import ProjectTrackingModel, {
  ProjectTrackingAttributes,
  ProjectTrackingPriority,
} from "./project_tracking.model";
import {
  GetProjectListFilter,
  GetProjectListSort,
} from "./project_tracking.types";
import { ProjectTrackingNotificationStatus } from "./project_tracking_notification.model";

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

  private getMappingProjectTrackingWithBrandQuery = (noJoin?: boolean) => `
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

  ${noJoin ? "LET products = (" : ""}
  FOR products IN products
  FILTER (products.brand_id == @brandId) AND 
    (products.id IN requestIds OR products.id IN projectProductIds)
  ${noJoin ? "RETURN products)" : ""}
    
  FOR u IN users
  FILTER u.id IN requestUsers OR u.id IN ppUsers

  FOR designers IN designers
  FILTER designers.id == u.relation_id

  `;

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
          ...this.DEFAULT_ATTRIBUTE,
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
      members: DesignerAttributes[];
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

    ${this.getMappingProjectTrackingWithBrandQuery(true)}

    LET notifications = (
      FOR ptn IN project_tracking_notifications
      FILTER ptn.project_tracking_id == project_trackings.id
      RETURN ptn
    )
    
    ${sort === "design_firm" ? `SORT designers.name ${order}` : ""}

    LET members = (
      FOR user IN users
      FILTER user.id IN project_trackings.assigned_teams
      RETURN KEEP(user, 'id', 'firstname', 'lastname', 'avatar')
    )

    RETURN {
      project_tracking: UNSET(project_trackings, ['_key','_id','_rev']),
      project: projects,
      projectRequests,
      designFirm: designers,
      notifications,
      products,
      members
    }
    `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async getListProjectTrackingTotal(
    brandId: string,
    filter: GetProjectListFilter
  ): Promise<number[]> {
    const params = {
      brandId,
      priority: filter.priority,
      projectStatus: filter.project_status,
    };
    const rawQuery = `
    ${
      typeof filter.priority === "number"
        ? `FILTER project_trackings.priority == @priority`
        : ""
    }

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    ${
      typeof filter.project_status === "number"
        ? "FILTER projects.status == @projectStatus"
        : ""
    }
    
    ${this.getMappingProjectTrackingWithBrandQuery(true)}

    COLLECT WITH COUNT INTO length
    RETURN length
    `;
    return this.model.rawQuery(rawQuery, params);
  }

  public getSummary = async (
    brandId: string
  ): Promise<
    {
      project: {
        total: number;
        live: number;
        onHold: number;
        archive: number;
      };
      request: {
        total: number;
        pending: number;
        responded: number;
      };
      notification: {
        total: number;
        keepInView: number;
        followedUp: number;
      };
    }[]
  > => {
    const params = {
      brandId,
      liveStatus: ProjectStatus.Live,
      onHoldStatus: ProjectStatus["On Hold"],
      archiveStatus: ProjectStatus.Archive,
      pending: ProjectRequestStatus.Pending,
      responded: ProjectRequestStatus.Responded,
      keepInView: ProjectTrackingNotificationStatus["Keep-in-view"],
      followedUp: ProjectTrackingNotificationStatus["Followed-up"],
    };
    const rawQuery = `
    LET mapping = (
      FOR project_trackings IN project_trackings

      FOR projects IN projects
      FILTER projects.id == project_trackings.project_id
  
      ${this.getMappingProjectTrackingWithBrandQuery(true)}

      LET notifications = (
        FOR ptn IN project_tracking_notifications
        FILTER ptn.project_tracking_id == project_trackings.id
        RETURN ptn
      )
      RETURN {projects, projectRequests, notifications}
    )

    LET projects = (
      FOR p in mapping
      RETURN p.projects
    )
    LET projectRequests = (
      FOR pr in mapping
      RETURN pr.projectRequests
    )
    LET notifications = (
      FOR pr in mapping
      RETURN pr.notifications
    )
   
    LET live = (
      FOR p IN projects
      FILTER p.status == @liveStatus
      COLLECT WITH COUNT INTO length
      RETURN length
    )
    LET onHold = (
      FOR p IN projects
      FILTER p.status == @onHoldStatus
      COLLECT WITH COUNT INTO length
      RETURN length
    )
    LET archive = (
      FOR p IN projects
      FILTER p.status == @archiveStatus
      COLLECT WITH COUNT INTO length
      RETURN length
    )

    LET allRequest = (
      FOR prs IN projectRequests
      FOR pr IN prs
      RETURN pr 
    )
    LET pending = (
      FOR prs IN projectRequests
      FOR pr IN prs
      FILTER pr.status == @pending
      RETURN pr 
    )
    LET responded = (
      FOR prs IN projectRequests
      FOR pr IN prs
      FILTER pr.status == @responded
      RETURN pr
    )

    LET allNoti = (
      FOR noti IN notifications
      FOR nt IN noti
      RETURN nt
    )
    LET keepInView = (
      FOR noti IN notifications
      FOR nt IN noti
      FILTER nt.status == @keepInView
      RETURN nt
    )
    LET followedUp = (
      FOR noti IN notifications
      FOR nt IN noti
      FILTER nt.status == @followedUp
      RETURN nt
    )

    RETURN {
      project: {
        total: LENGTH(projects),
        live: live[0],
        onHold: onHold[0],
        archive: archive[0]
      },
      request: {
        total: COUNT(FLATTEN(allRequest)),
        pending: COUNT(FLATTEN(pending)),
        responded: COUNT(FLATTEN(responded)),
      },
      notification: {
        total: COUNT(FLATTEN(allNoti)),
        keepInView: COUNT(FLATTEN(keepInView)),
        followedUp: COUNT(FLATTEN(followedUp)),
      },
    }
    `;
    return this.model.rawQueryV2(rawQuery, params);
  };

  public getOne = async (trackingId: string, userId: string) => {
    const params = { trackingId, userId };
    const rawQuery = `
    FILTER project_trackings.id == @trackingId
    FILTER project_trackings.deleted_at == null

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    FILTER projects.deleted_at == null

    LET projectRequests = (
      FOR project_requests IN project_requests
      FILTER project_requests.project_tracking_id == @trackingId
      FILTER project_requests.deleted_at == null
      FOR product in products
      FILTER product.id == project_requests.product_id
      FOR collection in collections
      FILTER collection.id == product.collection_id
      FOR common_type in common_types
      FILTER common_type.id == FIRST(project_requests.request_for_ids)
      LET newRequest = ( RETURN POSITION( project_requests.read_by, @userId) )
      RETURN MERGE(
        KEEP(project_requests, 'created_at','title', 'message', 'status','created_by'),
        {
          product: MERGE(
            KEEP(product, 'id', 'name', 'images', 'description'), 
            {collection_name: collection.name}
          ),
          newRequest: NOT newRequest[0],
          requestFor: common_type.name
        }
      )
    )

    LET notifications = (
      FOR notifications IN project_tracking_notifications
      FILTER notifications.project_tracking_id == @trackingId
      FILTER notifications.deleted_at == null
      FOR product in products
      FILTER product.id == notifications.product_id
      FOR collection in collections
      FILTER collection.id == product.collection_id
      LET newNotification = ( RETURN POSITION( notifications.read_by, @userId) )
      RETURN MERGE(
        KEEP(notifications, 'created_at','type', 'status', 'created_by'),
        {
          product: MERGE(
            KEEP(product, 'id', 'name', 'images', 'description'), 
            {collection_name: collection.name}
          ),
          newNotification: NOT newNotification[0]
        }
      )
    )

    LET firstTrackingItem = (
      RETURN FIRST(UNION(projectRequests, notifications))
    )

    LET designFirm = (
      FOR users IN users
      FILTER users.id == firstTrackingItem[0].created_by
      FOR designers IN designers
      FILTER designers.id == users.relation_id
      FOR locations IN locations
      FILTER locations.relation_id == designers.id
      RETURN MERGE(
        KEEP(designers, 'name', 'official_website'), 
        KEEP(users, 'phone', 'phone_code', 'email'), 
        {address: CONCAT_SEPARATOR(', ', locations.address, locations.city_name, locations.state_name, locations.country_name)}
      )
    )

    RETURN {
      projects: KEEP(projects, 'created_at','name','location','project_type','building_type','measurement_unit','design_due','construction_start'),
      projectRequests,
      notifications,
      designFirm: designFirm[0]
    }
    `;
    return this.model.rawQuery(rawQuery, params);
  };

  public updateReadBy = async (trackingId: string, userId: string) => {
    const params = { trackingId, userId, now: new Date() };
    const rawQuery = `
      FILTER project_trackings.id == @trackingId
      UPDATE project_trackings WITH { 
        read_by: UNIQUE( PUSH( project_trackings.read_by, @userId ) ),
        updated_at: @now
       } IN project_trackings
    `;
    return this.model.rawQuery(rawQuery, params);
  };
}

export const projectTrackingRepository = new ProjectTrackingRepository();

export default ProjectTrackingRepository;
