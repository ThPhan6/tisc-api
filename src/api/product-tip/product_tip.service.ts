import { PRODUCT_TIP_NULL_ATTRIBUTES } from "../../model/product_tip.model";
import { MESSAGES } from "../../constant/common.constant";
import ProductModel from "../../model/product.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IProductTipRequest,
  IProductTipResponse,
  IProductTipsResponse,
} from "./product_tip.type";
import ProductTipModel from "../../model/product_tip.model";
export default class ProductTipService {
  private productTipModel: ProductTipModel;
  private productModel: ProductModel;
  constructor() {
    this.productTipModel = new ProductTipModel();
    this.productModel = new ProductModel();
  }

  public create = async (
    payload: IProductTipRequest
  ): Promise<IProductTipResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundProduct = await this.productModel.find(payload.product_id);
      if (!foundProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const productTip = await this.productTipModel.findBy({
        title: payload.title.toLowerCase(),
      });
      if (productTip) {
        return resolve({
          message: MESSAGES.PRODUCT_TIP_EXISTS,
          statusCode: 400,
        });
      }

      const createdProductTip = await this.productTipModel.create({
        ...PRODUCT_TIP_NULL_ATTRIBUTES,
        product_id: payload.product_id,
        title: payload.title,
        content: payload.content,
      });
      if (!createdProductTip) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }

      const { is_deleted, ...rest } = createdProductTip;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = async (): Promise<
    IMessageResponse | IProductTipsResponse
  > => {
    return new Promise(async (resolve) => {
      const productTips = await this.productTipModel.getAll();
      if (!productTips) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }

      const result = productTips.map((item) => {
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
  ): Promise<IMessageResponse | IProductTipResponse> => {
    return new Promise(async (resolve) => {
      const foundProductTip = await this.productTipModel.find(id);
      if (!foundProductTip) {
        return resolve({
          message: MESSAGES.PRODUCT_TIP_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = foundProductTip;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = async (
    id: string,
    payload: IProductTipRequest
  ): Promise<IMessageResponse | IProductTipResponse> => {
    return new Promise(async (resolve) => {
      const foundProductTip = await this.productTipModel.find(id);
      if (!foundProductTip) {
        return resolve({
          message: MESSAGES.PRODUCT_TIP_NOT_FOUND,
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

      const updatedProductTip = await this.productTipModel.update(id, payload);
      if (!updatedProductTip) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }

      const { is_deleted, ...rest } = updatedProductTip;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundProductTip = await this.productTipModel.find(id);
      if (!foundProductTip) {
        return resolve({
          message: MESSAGES.PRODUCT_TIP_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedProductTip = await this.productTipModel.update(id, {
        is_deleted: true,
      });
      if (!updatedProductTip) {
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
