import { SortOrder, IProjectZoneAttributes } from "@/types";
import ProjectZoneModel from "@/model/project_zone.models";
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

  public async getListProjectZone(projectId: string, zoneOrder: SortOrder) {
    return this.model
      .select()
      .where("project_id", "==", projectId)
      .order("name", zoneOrder)
      .get();
  }
}

export const projectZoneRepository = new ProjectZoneRepository();
