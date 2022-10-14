import BaseRepository from "@/repositories/base.repository";
import {
  DesignerAttributes,
  ProjectAttributes,
  ProjectStatus,
  SortOrder,
} from "@/types";
import { v4 } from "uuid";
import {
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
import {
  ProjectTrackingNotificationAttributes,
  ProjectTrackingNotificationStatus,
} from "./project_tracking_notification.model";

class ProjectTrackingRepository extends BaseRepository<ProjectTrackingAttributes> {
  protected model: ProjectTrackingModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectTrackingAttributes> = {
    id: "",
    project_id: "",
    brand_id: "",
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
    projectId: string,
    brandId: string
  ): Promise<ProjectTrackingAttributes> {
    const now = new Date();
    const results = await this.model.rawQueryV2(
      `UPSERT {project_id: @projectId, brand_id: @brandId}
      INSERT @payloadWithId
      UPDATE {}
      IN project_trackings
      RETURN NEW
    `,
      {
        brandId,
        projectId,
        payloadWithId: {
          ...this.DEFAULT_ATTRIBUTE,
          project_id: projectId,
          brand_id: brandId,
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
      notifications: ProjectTrackingNotificationAttributes[];
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
    FILTER project_trackings.brand_id == @brandId

    LIMIT @offset, @limit
    ${sort === "created_at" ? `SORT project_trackings.${sort} ${order}` : ""}

    FOR project IN projects
    FILTER project.id == project_trackings.project_id
    ${
      typeof filter.project_status === "number"
        ? "FILTER project.status == @projectStatus"
        : ""
    }
    ${sort === "project_name" ? `SORT project.name ${order}` : ""}
    ${sort === "project_location" ? `SORT project.location ${order}` : ""}
    ${sort === "project_type" ? `SORT project.project_type ${order}` : ""}

    LET projectProducts = (
      FOR pp IN project_products
      FILTER pp.project_tracking_id == project_trackings.id
      RETURN pp
    )

    LET projectRequests = (
      FOR pr IN project_requests
      FILTER pr.project_tracking_id == project_trackings.id
      RETURN pr
    )

    LET notifications = (
      FOR ptn IN project_tracking_notifications
      FILTER ptn.project_tracking_id == project_trackings.id
      RETURN ptn
    )

    LET designFirm = (
      FOR df IN designers
      FILTER df.id == project.design_id
      RETURN df
    )
    ${sort === "design_firm" ? `SORT designFirm.name ${order}` : ""}

    LET members = (
      FOR user IN users
      FILTER user.id IN project_trackings.assigned_teams
      RETURN KEEP(user, 'id', 'firstname', 'lastname', 'avatar')
    )

    RETURN {
      project_tracking: UNSET(project_trackings, ['_key','_id','_rev']),
      project,
      projectRequests,
      designFirm: designFirm[0],
      notifications,
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
    FILTER project_trackings.brand_id == @brandId

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    ${
      typeof filter.project_status === "number"
        ? "FILTER projects.status == @projectStatus"
        : ""
    }
    
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
      FOR pt IN project_trackings
      FILTER pt.brand_id == @brandId

      LET projects = (
        FOR prj IN projects
        FILTER prj.id == pt.project_id
        RETURN prj
      )

      LET projectRequests = (
        FOR pr IN project_requests
        FILTER pr.project_tracking_id == pt.id
        RETURN pr
      )

      LET notifications = (
        FOR ptn IN project_tracking_notifications
        FILTER ptn.project_tracking_id == pt.id
        RETURN ptn
      )
      RETURN {projects: projects[0], projectRequests, notifications}
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

  public getOne = async (
    trackingId: string,
    userId: string,
    brandId: string
  ) => {
    const params = { trackingId, userId, brandId };
    const rawQuery = `
    FILTER project_trackings.id == @trackingId
    FILTER project_trackings.brand_id == @brandId
    FILTER project_trackings.deleted_at == null

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    FILTER projects.deleted_at == null

    LET projectRequests = (
      FOR pr IN project_requests
      FILTER pr.project_tracking_id == @trackingId
      FILTER pr.deleted_at == null
      FOR product in products
      FILTER product.id == pr.product_id
      FOR collection in collections
      FILTER collection.id == product.collection_id
      FOR common_type in common_types
      FILTER common_type.id == FIRST(pr.request_for_ids)
      LET newRequest = ( RETURN POSITION( pr.read_by, @userId) )
      FOR u IN users
      FILTER u.id == pr.created_by
      LET loc = (
        FOR loc IN locations
        FILTER loc.id == u.location_id
        RETURN loc
      )
      RETURN MERGE(
        KEEP(pr, 'created_at','title', 'message', 'status','created_by'),
        {
          product: MERGE(
            KEEP(product, 'id', 'name', 'images', 'description'), 
            {collection_name: collection.name}
          ),
          newRequest: NOT newRequest[0],
          requestFor: common_type.name,
          designer: MERGE(
            KEEP(u, 'location_id','firstname','lastname','position','email','position','phone'),
             {phone_code: loc[0].phone_code}
          )
        }
      )
    )

    LET notifications = (
      FOR notifications IN project_tracking_notifications
      FILTER notifications.project_tracking_id == @trackingId
      FILTER notifications.deleted_at == null
      FOR product in products
      FILTER product.id == notifications.product_id
      FILTER product.brand_id == @brandId
      FOR collection in collections
      FILTER collection.id == product.collection_id
      LET newNotification = ( RETURN POSITION( notifications.read_by, @userId) )
      FOR u IN users
      FILTER u.id == notifications.created_by
      LET loc = (
        FOR loc IN locations
        FILTER loc.id == u.location_id
        RETURN loc
      )
      RETURN MERGE(
        KEEP(notifications, 'created_at','type', 'status', 'created_by'),
        {
          product: MERGE(
            KEEP(product, 'id', 'name', 'images', 'description'), 
            {collection_name: collection.name}
          ),
          newNotification: NOT newNotification[0],
          designer: MERGE(
            KEEP(u, 'location_id','firstname','lastname','position','email','position','phone'),
             {phone_code: loc[0].phone_code}
          ) 
        }
      )
    )

    LET designFirm = (
      FOR designers IN designers
      FILTER designers.id == projects.design_id
      FOR locations IN locations
      FILTER locations.relation_id == designers.id
      RETURN MERGE(
        KEEP(designers, 'name', 'official_website'),
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

  public updateUniqueAttribute = async (
    modelName: string,
    attributeName: string, // attribute with array type
    modelId: string,
    newValue: string
  ) => {
    const params = {
      modelId,
      newValue,
      now: new Date(),
    };
    const rawQuery = `
      FOR ${modelName} IN ${modelName}
      FILTER ${modelName}.id == @modelId
      UPDATE ${modelName} WITH { 
        ${attributeName}: UNIQUE( PUSH( ${modelName}.${attributeName}, @newValue ) ),
        updated_at: @now
       } IN ${modelName}
    `;
    return this.model.rawQueryV2(rawQuery, params);
  };
}

export const projectTrackingRepository = new ProjectTrackingRepository();

export default ProjectTrackingRepository;
