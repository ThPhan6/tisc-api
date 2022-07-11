import { MESSAGES } from "./../../constant/common.constant";
import ProductModel from "../../model/product.model";
import ProductCatelogueNDownloadModel, {
  PRODUCT_CATELOGUE_N_DOWNLOAD_NULL_ATTRIBUTES,
} from "../../model/product_catelogue_n_download";
import { IMessageResponse } from "../../type/common.type";
import {
  IProductCatelogueNDownloadRequest,
  IProductCatelogueNDownloadResponse,
  IUpdateProductCatelogueNDownloadRequest,
} from "./type";
import { v4 as uuid } from "uuid";
export default class ProductCatelogueNDownloadService {
  private model: ProductCatelogueNDownloadModel;
  private productModel: ProductModel;
  constructor() {
    this.model = new ProductCatelogueNDownloadModel();
    this.productModel = new ProductModel();
  }

  public create = async (
    payload: IProductCatelogueNDownloadRequest
  ): Promise<IMessageResponse | IProductCatelogueNDownloadResponse> => {
    return new Promise(async (resolve) => {
      const productCatelogue = await this.model.findBy({
        product_id: payload.product_id,
      });
      if (productCatelogue) {
        return resolve({
          message: MESSAGES.PRODUCT_CATELOGUE_DOWNLOAD_EXISTED,
          statusCode: 400,
        });
      }
      const product = await this.productModel.find(payload.product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const newContents = payload.contents.map((content) => {
        return {
          ...content,
          id: uuid(),
        };
      });
      const created = await this.model.create({
        ...PRODUCT_CATELOGUE_N_DOWNLOAD_NULL_ATTRIBUTES,
        product_id: payload.product_id,
        contents: newContents,
      });
      if (!created) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(payload.product_id));
    });
  };

  public get = async (
    product_id: string
  ): Promise<IMessageResponse | IProductCatelogueNDownloadResponse> => {
    return new Promise(async (resolve) => {
      const found = await this.model.findBy({ product_id });
      if (!found) {
        return resolve({
          message: MESSAGES.PRODUCT_CATELOGUE_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }

      const { is_deleted, ...rest } = found;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = async (
    product_id: string,
    payload: IUpdateProductCatelogueNDownloadRequest
  ): Promise<IMessageResponse | IProductCatelogueNDownloadResponse> => {
    return new Promise(async (resolve) => {
      const found = await this.model.findBy({ product_id });
      if (!found) {
        return resolve({
          message: MESSAGES.PRODUCT_CATELOGUE_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }
      const newContents = payload.contents.map((content) => {
        if (content.id) {
          return content;
        }
        return {
          ...content,
          id: uuid(),
        };
      });
      const updatedProductDownload = await this.model.update(found.id, {
        contents: newContents,
      });
      if (!updatedProductDownload) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }

      return resolve(await this.get(product_id));
    });
  };

  public delete = async (product_id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const found = await this.model.findBy({ product_id });
      if (!found) {
        return resolve({
          message: MESSAGES.PRODUCT_CATELOGUE_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updated = await this.model.update(found.id, {
        is_deleted: true,
      });
      if (!updated) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
