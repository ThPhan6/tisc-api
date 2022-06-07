export interface ICollection {
  id: string;
  name: string;
  created_at: string;
}
export interface ICollectionRequest {
  name: string;
}
export interface ICollectionResponse {
  data: ICollection;
  statusCode: number;
}
export interface ICollectionsResponse {
  data: ICollection[];
  statusCode: number;
}
