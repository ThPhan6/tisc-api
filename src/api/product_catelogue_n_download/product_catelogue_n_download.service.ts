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
} from "./product_catelogue_n_download.type";
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
  ): Promise<IMessageResponse | IProductCatelogueNDownloadResponse | any> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.find(payload.product_id);
      if (!product) {
        return resolve({
          data: {},
          statusCode: 200,
        });
      }

      const productCatelogue = await this.model.findBy({
        product_id: payload.product_id,
      });
      if (!productCatelogue) {
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
      } else {
        const newContents = payload.contents.map((content: any) => {
          if (content.id) {
            const found = productCatelogue.contents.find(
              (item) => item.id === content.id
            );
            if (found) return content;
          }
          return {
            ...content,
            id: uuid(),
          };
        });
        const updated = await this.model.update(productCatelogue.id, {
          contents: newContents,
        });
        if (!updated) {
          return resolve({
            message: MESSAGES.SOMETHING_WRONG_CREATE,
            statusCode: 400,
          });
        }
      }
      return resolve(await this.get(payload.product_id));
    });
  };

  public get = async (
    product_id: string
  ): Promise<IProductCatelogueNDownloadResponse | any> => {
    return new Promise(async (resolve) => {
      const found = await this.model.findBy({ product_id });
      if (!found) {
        return resolve({
          data: {},
          statusCode: 200,
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
