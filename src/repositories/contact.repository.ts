import { IContactsResponse } from "@/api/contact/contact.type";
import ContactModel from "@/model/contact.model";
import { IContactAttributes } from "@/types/contact.type";
import BaseRepository from "./base.repository";

class ContactRepository extends BaseRepository<IContactAttributes> {
  protected model: ContactModel;
  protected DEFAULT_ATTRIBUTE: Partial<IContactAttributes> = {
    name: "",
    email: "",
    inquiry: "",
    created_at: "",
  };
  constructor() {
    super();
    this.model = new ContactModel();
  }

  public async getListContact(
    limit: number,
    offset: number,
    _filter: any,
    sort: any
  ) {
    return (await this.model
      .select("*")
      .order(sort[0], sort[1])
      .limit(limit, offset)
      .get()) as IContactsResponse;
  }
}

export default ContactRepository;
