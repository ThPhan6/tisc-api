export interface IContactAttributes {
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
  data: IContactAttributes[];
  statusCode: number;
}

export interface IContactResponse {
  data: IContactAttributes;
  statusCode: number;
}
