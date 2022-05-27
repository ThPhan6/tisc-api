import { IContactAttribute } from "./../api/contact/contact.type";
import Model from "./index";

export default class ContactModel extends Model<IContactAttribute> {
  constructor() {
    super("contacts");
  }
}
