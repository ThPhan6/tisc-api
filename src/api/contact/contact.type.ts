export interface IContactAttribute {
  id: string;
  name: string;
  email: string;
  inquity: string | null;
  created_at: any;
}

export interface IContactRequest {
  name: string;
  email: string;
  inquity?: string;
}

export interface IContactsResponse {
  data: IContactAttribute[];
  statusCode: number;
}

export interface IContactResponse {
  data: IContactAttribute;
  statusCode: number;
}
