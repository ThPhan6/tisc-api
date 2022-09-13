export interface ArangoDocument {
  _id: string;
  _key: string;
  _rev: string;
  deleted_at?: string;
  deleted_by?: string;
  new?: ArangoDocument;
}
