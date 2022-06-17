import { IMessageResponse } from "../../type/common.type";
import {
  IProductDownloadRequest,
  IProductDownloadResponse,
} from "./product_download.type";
export default class ProductDownloadService {
  constructor() {}

  public create = async (
    payload: IProductDownloadRequest
  ): Promise<IMessageResponse | IProductDownloadResponse> => {
    return new Promise(async (resolve) => {
        const foundProduct = await this.
    });
  };
}
