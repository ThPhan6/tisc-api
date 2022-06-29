import Model from "./index";

export interface IAutoEmailAttributes {
  id: string;
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
  is_deleted: boolean;
  created_at: string;
}
export default class AutoEmailModel extends Model<IAutoEmailAttributes> {
  constructor() {
    super("email_autoresponders");
  }
}
