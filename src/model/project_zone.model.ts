import Model from "./index";

export interface IProjectZoneAttributes {
  id: string;
  project_id: string;
  name: string;
  areas: {
    id: string;
    name: string;
    rooms: {
      id: string;
      room_name: string;
      room_id: string;
      room_size: number;
      quantity: number;
      sub_total: number;
    }[];
  }[];
  created_at: string;
  is_deleted: boolean;
}

export const PROJECT_ZONE_NULL_ATTRIBUTES = {
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
          room_size: "",
          quantity: 0,
          sub_total: 0,
        },
      ],
    },
  ],
  created_at: "",
  is_deleted: false,
};

export default class ProjectZoneModel extends Model<IProjectZoneAttributes> {
  constructor() {
    super("project_zones");
  }
  public findByNameOrId = (
    id: string
  ): Promise<IProjectZoneAttributes | false> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .first();
    } catch (error) {
      return new Promise((resolve) => resolve(false));
    }
  };

  public getExistedProjectZone = async (
    id: string,
    name: string,
    projectId: string
  ) => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("id", id)
        .whereNot("is_deleted", true)
        .where("name", name.toLowerCase())
        .where("project_id", projectId)
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
