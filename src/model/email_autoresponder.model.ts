import Model from "./index";

export interface IEmailAutoAttributes {
  id: string;
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
  is_deleted: boolean;
  created_at: string;
}
export default class EmailAutoModel extends Model<IEmailAutoAttributes> {
  constructor() {
    super("email_autoresponders");
  }
}
