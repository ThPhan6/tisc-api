export interface IMaterialCodeAttributes {
  id: string;
  name: string;
  subs: {
    id: string;
    name: string;
    codes: ICodeAttribute[];
  }[];
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export interface ICodeAttribute {
  id: string;
  code: string;
  description: string;
}
