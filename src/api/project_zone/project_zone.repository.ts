import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/type/common.type";
import ProjectZoneModel, { ProjectZoneAttributes } from "./project_zone.models";

class ProjectZoneRepository extends BaseRepository<ProjectZoneAttributes> {
  protected model: ProjectZoneModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectZoneAttributes> = {
    id: "",
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
    is_deleted: false,
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
}

export const projectZoneRepository = new ProjectZoneRepository();

export default ProjectZoneRepository;
