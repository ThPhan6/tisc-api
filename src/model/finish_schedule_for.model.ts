import Model from "./index";

export interface IFinishScheduleForAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
  design_id: null,
};

export default class FinishScheduleForModel extends Model<IFinishScheduleForAttributes> {
  constructor() {
    super("finish_schedules_for");
  }
  public findByNameOrId = (
    id: string,
    relation_id: string
  ): Promise<Partial<IFinishScheduleForAttributes> | undefined> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .whereOr("design_id", [relation_id, ""])
        .first();
    } catch (error) {
      return Promise.resolve(undefined);
    }
  };
  public getCustomList = (
    relation_id: string
  ): Promise<Pick<IFinishScheduleForAttributes, "id" | "name">[]> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOr("design_id", [relation_id, ""])
        .orderBy("name", "ASC")
        .select(["id", "name"]);
    } catch (error) {
      return Promise.resolve([]);
    }
  };
}
