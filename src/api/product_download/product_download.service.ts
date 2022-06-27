import { MESSAGES } from "./../../constant/common.constant";
import ProductModel from "../../model/product.model";
import ProductDownloadModel, {
  PRODUCT_DOWNLOAD_NULL_ATTRIBUTES,
} from "../../model/product_download.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IProductDownloadRequest,
  IProductDownloadResponse,
  IProductDownloadsResponse,
} from "./product_download.type";
export default class ProductDownloadService {
  private productDownloadModel: ProductDownloadModel;
  private productModel: ProductModel;
  constructor() {
    this.productDownloadModel = new ProductDownloadModel();
    this.productModel = new ProductModel();
  }

  public create = async (
    payload: IProductDownloadRequest
  ): Promise<IMessageResponse | IProductDownloadResponse> => {
    return new Promise(async (resolve) => {
      const foundProduct = await this.productModel.find(payload.product_id);
      if (!foundProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const productDownload = await this.productDownloadModel.findBy({
        file_name: payload.file_name,
        product_id: payload.product_id,
      });
      if (productDownload) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_EXISTS,
          statusCode: 400,
        });
      }

      const createdProductDownload = await this.productDownloadModel.create({
        ...PRODUCT_DOWNLOAD_NULL_ATTRIBUTES,
        product_id: payload.product_id,
        file_name: payload.file_name,
        url: payload.url,
      });
      if (!createdProductDownload) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = createdProductDownload;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = async (): Promise<
    IMessageResponse | IProductDownloadsResponse
  > => {
    return new Promise(async (resolve) => {
      const productDownloads = await this.productDownloadModel.getAll();
      if (!productDownloads) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = productDownloads.map((item) => {
        const { is_deleted, ...rest } = item;
        return rest;
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public getById = async (
    id: string
  ): Promise<IMessageResponse | IProductDownloadResponse> => {
    return new Promise(async (resolve) => {
      const foundProductDownload = await this.productDownloadModel.find(id);
      if (!foundProductDownload) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }

      const { is_deleted, ...rest } = foundProductDownload;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = async (
    id: string,
    payload: IProductDownloadRequest
  ): Promise<IMessageResponse | IProductDownloadResponse> => {
    return new Promise(async (resolve) => {
      const foundProductDownload = await this.productDownloadModel.find(id);
      if (!foundProductDownload) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProduct = await this.productModel.find(payload.product_id);
      if (!foundProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const productDownload =
        await this.productDownloadModel.getDuplicatedProductDownload(
          id,
          payload.file_name
        );
      if (productDownload) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_EXISTS,
          statusCode: 400,
        });
      }
      const updatedProductDownload = await this.productDownloadModel.update(
        id,
        payload
      );
      if (!updatedProductDownload) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }

      const { is_deleted, ...rest } = updatedProductDownload;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundProductDownload = await this.productDownloadModel.find(id);
      if (!foundProductDownload) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedProductDownload = await this.productDownloadModel.update(
        id,
        { is_deleted: true }
      );
      if (!updatedProductDownload) {
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
  public getDownloadsByProductId = (
    productId: string
  ): Promise<IMessageResponse | IProductDownloadsResponse> => {
    return new Promise(async (resolve) => {
      const downloadsOfProduct = await this.productDownloadModel.getBy({
        product_id: productId,
      });
      if (!downloadsOfProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_DOWNLOAD_NOT_FOUND,
          statusCode: 404,
        });
      }

      const result = downloadsOfProduct.map((item) => {
        const { is_deleted, ...rest } = item;
        return rest;
      });

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
