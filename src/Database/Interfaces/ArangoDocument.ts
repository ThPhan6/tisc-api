export interface ArangoDocument {
  _id: string;
  _key: string;
  _rev: string;
  new?: ArangoDocument;
}
