import { SortOrder, IProjectZoneAttributes } from "@/types";
import ProjectZoneModel from "@/models/project_zone.model";
import BaseRepository from "./base.repository";

class ProjectZoneRepository extends BaseRepository<IProjectZoneAttributes> {
  protected model: ProjectZoneModel;
  protected DEFAULT_ATTRIBUTE: Partial<IProjectZoneAttributes> = {
    project_id: "",
    name: "",
    areas: [
      {
        id: "",
        name: "",
        rooms: [
          {
            id: "",
            room_name: "",
            room_id: "",
            room_size: 0,
            quantity: 0,
            sub_total: 0,
          },
        ],
      },
    ],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new ProjectZoneModel();
  }

  public getByProjectId = async (project_id: string, zoneOrder: SortOrder) => {
    return this.model
      .select("id", "name", "areas")
      .where("project_id", "==", project_id)
      .order("name", zoneOrder)
      .get();
  };

  public async findByNameOrId(id: string, relation_id: string) {
    return (await this.model
      .where("id", "==", id)
      .orWhere("name", "==", id)
      .where("relation_id", "==", relation_id)
      .first()) as IProjectZoneAttributes;
  }

  public async getExistedProjectZone(
    id: string,
    name: string,
    projectId: string
  ) {
    return this.model
      .where("id", "!=", id)
      .where("name", "==", name)
      .where("project_id", "==", projectId)
      .first();
  }

  public async getListProjectZone(projectId: string, zoneOrder?: SortOrder) {
    return this.model
      .select()
      .where("project_id", "==", projectId)
      .order(zoneOrder ? "name" : "created_at", zoneOrder || "DESC")
      .get();
  }

  public getListWithTotalsize = async (
    projectId: string
  ): Promise<
    IProjectZoneAttributes &
      {
        total_size: number;
        areas: IProjectZoneAttributes["areas"][0] &
          {
            total_size: number;
          }[];
      }[]
  > => {
    return this.model.rawQuery(
      `
      FILTER project_zones.deleted_at == null
      FILTER project_zones.project_id == @projectId
      SORT project_zones.name ASC
      RETURN merge(project_zones, {
        total_size: SUM(FOR area IN project_zones.areas FOR room in area.rooms return room.quantity * room.room_size),
        areas: (FOR area IN project_zones.areas return merge(area, {
            total_size: SUM(FOR room in area.rooms return room.quantity * room.room_size)
        }))
      })`,
      { projectId }
    );
  };
}

export const projectZoneRepository = new ProjectZoneRepository();
