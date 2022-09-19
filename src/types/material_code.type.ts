export interface IMaterialCodeAttributes {
  id: string;
  name: string;
  subs: {
    id: string;
    name: string;
    codes: ICodeAttribute[];
  }[];
  created_at: string;
  updated_at: string | null;
  design_id: string;
}

export interface ICodeAttribute {
  id: string;
  code: string;
  description: string;
}
