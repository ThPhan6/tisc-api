import Model from "./index";

export interface IProductCatelogueNDownload {
  id: string;
  product_id: string;
  contents: {
    id: string;
    title: string;
    url: string;
  }[];
  created_at: string;
  is_deleted: boolean;
}

export const PRODUCT_CATELOGUE_N_DOWNLOAD_NULL_ATTRIBUTES = {
  id: null,
  product_id: null,
  contents: [],
  created_at: null,
  is_deleted: false,
};
export default class ProductDownloadModel extends Model<IProductCatelogueNDownload> {
  constructor() {
    super("product_catelogue_n_downloads");
  }
}
