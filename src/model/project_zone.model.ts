import Model from "./index";

export interface IProjectZoneAttributes {
  id: string;
  project_id: string;
  name: string;
  area: {
    name: string;
    room: {
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
  area: [
    {
      name: "",
      room: [
        {
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
  public findByNameOrId = async (id: string): Promise<any> => {
    try {
      const result = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
