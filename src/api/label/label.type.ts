export interface ILabelRequest {
  name: string;
}
export interface UpdateLabelRequest {
  name: string;
}
export type LabelEntity = {
  id: string;
  name: string;
  created_at: string;
};
export interface ILabelResponse {
  data: LabelEntity[];
  statusCode: number;
}
