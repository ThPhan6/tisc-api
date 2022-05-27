export interface IContactAttribute {
  id: string;
  name: string;
  email: string;
  inquity?: string;
  created_at: any;
}

export interface IContactRequest {
  name: string;
  email: string;
  inquity?: string;
}
