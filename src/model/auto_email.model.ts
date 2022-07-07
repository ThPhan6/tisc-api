import Model from "./index";

export interface IAutoEmailAttributes {
  id: string;
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
  created_at: string;
  is_deleted: boolean;
}
export default class AutoEmailModel extends Model<IAutoEmailAttributes> {
  constructor() {
    super("email_autoresponders");
  }
}
