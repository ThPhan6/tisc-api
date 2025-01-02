import BaseRepository from "@/repositories/base.repository";
import { locationRepository } from "@/repositories/location.repository";
import {
  DesignerAttributes,
  UserType,
  ProjectAttributes,
  ProjectStatus,
  RespondedOrPendingStatus,
  SortOrder,
  ProjectTrackingEntity,
  ProjectTrackingPriority,
} from "@/types";
import { isNumber } from "lodash";
import { v4 } from "uuid";
import { ProjectRequestAttributes } from "../api/project_tracking/project_request.model";

import {
  GetProjectListFilter,
  GetProjectListSort,
} from "../api/project_tracking/project_tracking.types";
import {
  ProjectTrackingNotificationAttributes,
  ProjectTrackingNotificationStatus,
} from "../api/project_tracking/project_tracking_notification.model";
import ProjectTrackingModel from "@/models/project_tracking.model";

class ProjectTrackingRepository extends BaseRepository<ProjectTrackingEntity> {
  protected model: ProjectTrackingModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectTrackingEntity> = {
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
  ): Promise<ProjectTrackingEntity> {
    const now = new Date();
    const results = await this.model.rawQueryV2(
      `UPSERT {project_id: @projectId, brand_id: @brandId, deleted_at: null}
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
    order: SortOrder,
    userId?: string
  ): Promise<
    {
      project_tracking: ProjectTrackingEntity;
      project: ProjectAttributes;
      projectLocation: string;
      projectRequests: ProjectRequestAttributes[];
      designFirm: DesignerAttributes;
      members: DesignerAttributes[];
      notifications: ProjectTrackingNotificationAttributes[];
    }[]
  > {
    const params = {
      userId,
      brandId,
      offset,
      limit,
      priority: filter.priority,
      projectStatus: filter.project_status as number,
    };
    const rawQuery = `
    FILTER project_trackings.brand_id == @brandId
    FILTER project_trackings.deleted_at == null
    ${
      typeof filter.priority === "number"
        ? `FILTER project_trackings.priority == @priority`
        : ""
    }

    ${sort === "created_at" ? `SORT project_trackings.${sort} ${order}` : ""}

    FOR project IN projects
    FILTER project.id == project_trackings.project_id
    FILTER project.deleted_at == null
    ${
      typeof filter.project_status === "number"
        ? "FILTER project.status == @projectStatus"
        : ""
    }
    ${sort === "project_name" ? `SORT project.name ${order}` : ""}
    ${sort === "project_type" ? `SORT project.project_type ${order}` : ""}

    FOR loc IN locations
    FILTER loc.deleted_at == null
    FILTER loc.id == project.location_id
    LET location = ${locationRepository.getShortLocationQuery("loc")}
    ${sort === "project_location" ? `SORT location ${order}` : ""}

    LET projectRequests = (
      FOR pr IN project_requests
      FILTER pr.project_tracking_id == project_trackings.id
      FILTER pr.deleted_at == null
      RETURN pr
    )

    LET notifications = (
      FOR ptn IN project_tracking_notifications
      FILTER ptn.project_tracking_id == project_trackings.id
      FILTER ptn.deleted_at == null
      RETURN ptn
    )

    LET designFirm = (
      FOR df IN designers
      FILTER df.id == project.design_id
      FILTER df.deleted_at == null
      RETURN df
    )
    ${sort === "design_firm" ? `SORT designFirm[0].name ${order}` : ""}

    LET members = (
      FOR user IN users
      FILTER user.id IN project_trackings.assigned_teams
      FILTER user.deleted_at == null
      RETURN KEEP(user, 'id', 'firstname', 'lastname', 'avatar')
    )

    ${userId ? "FILTER @userId IN members[*].id" : ""}

    ${isNumber(offset) && isNumber(limit) ? "LIMIT @offset, @limit" : ""}
    RETURN {
      project_tracking: UNSET(project_trackings, ['_key','_id','_rev']),
      project,
      projectLocation: location,
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
      projectStatus: filter.project_status as number,
    };
    const rawQuery = `
    FILTER project_trackings.deleted_at == null
    FILTER project_trackings.brand_id == @brandId
    ${
      typeof filter.priority === "number"
        ? `FILTER project_trackings.priority == @priority`
        : ""
    }

    FOR projects IN projects
    FILTER projects.deleted_at == null
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
    brandId: string,
    userId?: string
  ): Promise<
    {
      project: {
        total: number;
        live: number;
        onHold: number;
        archived: number;
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
      archiveStatus: ProjectStatus.Archived,
      pending: RespondedOrPendingStatus.Pending,
      responded: RespondedOrPendingStatus.Responded,
      keepInView: ProjectTrackingNotificationStatus["Keep-in-view"],
      followedUp: ProjectTrackingNotificationStatus["Followed-up"],
      userId,
    };
    const rawQuery = `
    LET mapping = (
      FOR pt IN project_trackings
      FILTER pt.brand_id == @brandId
      && pt.deleted_at == null
      ${userId ? "&& @userId IN pt.assigned_teams" : ""}

      FOR prj IN projects
      FILTER prj.id == pt.project_id
      && prj.deleted_at == null

      LET projectRequests = (
        FOR pr IN project_requests
        FILTER pr.project_tracking_id == pt.id
        && pr.deleted_at == null
        RETURN pr
      )

      LET notifications = (
        FOR ptn IN project_tracking_notifications
        FILTER ptn.deleted_at == null
        && ptn.project_tracking_id == pt.id
        RETURN ptn
      )
      RETURN {projects: prj, projectRequests, notifications}
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
    LET archived = (
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
        archived: archived[0]
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
    const params = {
      trackingId,
      userId,
      brandId,
      designLocation: UserType.Designer,
    };
    const rawQuery = `
    FILTER project_trackings.id == @trackingId
    FILTER project_trackings.brand_id == @brandId
    FILTER project_trackings.deleted_at == null

    FOR projects IN projects
    FILTER projects.id == project_trackings.project_id
    FILTER projects.deleted_at == null
    FOR l IN locations
    FILTER l.id == projects.location_id

    LET projectRequests = (
      FOR pr IN project_requests
      FILTER pr.project_tracking_id == @trackingId
      FILTER pr.deleted_at == null
      SORT pr.created_at DESC

      FOR product in products
      FILTER product.id == pr.product_id
      FILTER product.deleted_at == null

      FOR collection in collections
      FILTER collection.id in product.collection_ids
      FILTER collection.deleted_at == null

      FOR common_type in common_types
      FILTER common_type.id == FIRST(pr.request_for_ids)
      FILTER common_type.deleted_at == null
      LET newRequest = ( RETURN POSITION( pr.read_by, @userId) )

      FOR u IN users
      FILTER u.id == pr.created_by
      FILTER u.deleted_at == null

      LET loc = (
        FOR loc IN locations
        FILTER loc.deleted_at == null
        FILTER loc.id == u.location_id
        RETURN loc
      )
      RETURN MERGE(
        KEEP(pr, 'id','created_at','title', 'message', 'status','created_by'),
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
      SORT notifications.created_at DESC

      FOR pr in project_products
      FILTER pr.id == notifications.project_product_id

      FOR p in products
      FILTER p.id == pr.product_id
      FILTER p.deleted_at == null

      LET projectProduct = FIRST((
        FOR pp IN project_products
        FILTER pp.product_id == p.id
        FILTER pp.project_id == projects.id
        FILTER pp.deleted_at == null
        RETURN pp
      ))

      FOR c in collections
      FILTER c.id in p.collection_ids
      FILTER c.deleted_at == null

      FOR u IN users
      FILTER u.id == notifications.created_by
      FILTER u.deleted_at == null

      LET loc = (
        FOR loc IN locations
        FILTER loc.id == u.location_id
        FILTER loc.deleted_at == null
        RETURN loc
      )

      LET newNotification = ( RETURN POSITION( notifications.read_by, @userId) )
      RETURN MERGE(
        KEEP(notifications, 'id','created_at','type', 'status', 'created_by'),
        {
          projectProductId: projectProduct.id,
          product: MERGE(
            KEEP(p, 'id', 'name', 'images', 'description'),
            {collection_name: c.name}
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
      FOR designer IN designers
      FILTER designer.id == projects.design_id
      FILTER designer.deleted_at == null
      FOR loc IN locations
      FILTER loc.relation_id == designer.id
      FILTER loc.type == @designLocation
      FILTER loc.deleted_at == null

      LET allLocations = (
        LET mergedUsers = UNION(notifications, projectRequests)
        LET designerUserIds = (
          FOR mu IN mergedUsers
          RETURN mu.created_by
        )
        LET designerUserLocations = (
          FOR du IN users
          FILTER du.deleted_at == null
          FILTER du.id IN UNIQUE(designerUserIds)
          FOR duLoc IN locations
          FILTER duLoc.deleted_at == null
          FILTER duLoc.id == du.location_id
          COLLECT location = duLoc INTO usersByLocation
          RETURN {location, users: usersByLocation[*].du}
        )
        LET groupData = (
          FOR designerUserLocation IN designerUserLocations
          LET teamMembers = (
            FOR u IN designerUserLocation.users
            RETURN KEEP(u, 'firstname','lastname','position')
          )
          RETURN MERGE(
            KEEP(designerUserLocation.location, 'city_name','country_name','address','general_phone','phone_code','general_email'),
            {teamMembers: teamMembers}
          )
        )
        RETURN groupData
      )
      RETURN MERGE(
        KEEP(designer, 'name', 'official_website'),
        { locations: allLocations[0] }
      )
    )

    RETURN {
      projects: MERGE(
        KEEP(projects, 'created_at','name','project_type','building_type','measurement_unit','design_due','construction_start','id'),
        { location: ${locationRepository.getShortLocationQuery("l")}}
      ),
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
      FILTER ${modelName}.deleted_at == null
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
