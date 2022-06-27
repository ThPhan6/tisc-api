import Model from "./index";

export interface IContactAttributes {
  id: string;
  name: string;
  email: string;
  inquiry: string | null;
  created_at: any;
  is_deleted: boolean;
}
export const CONTACT_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  email: null,
  inquiry: null,
  created_at: null,
  is_deleted: false,
};
export default class ContactModel extends Model<IContactAttributes> {
  constructor() {
    super("contacts");
  }
}
