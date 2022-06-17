import Model from "./index";

export interface IProductDownload {
  id: string;
  product_id: string;
  file_name: string;
  url: string;
  created_at: string;
  is_deleted: boolean;
}

export const PRODUCT_DOWNLOAD_NULL_ATTRIBUTES = {
  id: null,
  product_id: null,
  file_name: null,
  url: null,
  created_at: null,
  is_deleted: false,
};
export default class ProductDownloadModel extends Model<IProductDownload> {
  constructor() {
    super("product_downloads");
  }
}
