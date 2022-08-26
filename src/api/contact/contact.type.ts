export interface IContact {
  id: string;
  name: string;
  email: string;
  inquiry: string | null;
  created_at: any;
}

export interface IContactRequest {
  name: string;
  email: string;
  inquiry?: string;
}

export interface IContactsResponse {
  data: IContact[];
  statusCode: number;
}

export interface IContactResponse {
  data: IContact;
  statusCode: number;
}
