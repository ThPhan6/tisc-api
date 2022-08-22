import ProductModel from "../../model/product.model";
import UserModel from "../../model/user.model";
import { MESSAGES } from "./../../constant/common.constant";
import { IMessageResponse } from "../../type/common.type";
import LocationModel from "../../model/location.model";

export default class FavouriteService {
  private productModel: ProductModel;
  private userModel: UserModel;
  private locationModel: LocationModel;
  constructor() {
    this.productModel = new ProductModel();
    this.userModel = new UserModel();
    this.locationModel = new LocationModel();
  }

  public skip = (userId: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(userId);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 400,
        });
      }
      if (user.retrieve_favourite) {
        return resolve({
          message: MESSAGES.FAVOURITE.ALREADY_SKIPPED,
          statusCode: 400,
        });
      }
      const updatedUser = await this.userModel.update(userId, {
        retrieve_favourite: true,
      });

      if (!updatedUser) {
        return resolve({
          message: MESSAGES.FAVOURITE.FAILED_TO_SKIP,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public retrieve = (
    backupEmail: string,
    personalMobile: string,
    phone_code: string,
    userId: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.getInactiveDesignFirmByBackupData(
        backupEmail,
        personalMobile
      );
      const location = await this.locationModel.find(user?.location_id || "");

      if (!user || (location && location.phone_code !== phone_code)) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 400,
        });
      }
      if (user.retrieve_favourite) {
        return resolve({
          message: MESSAGES.FAVOURITE.ALREADY_RETRIEVED,
          statusCode: 400,
        });
      }
      ///
      const previousLikedProducts =
        await this.productModel.getUserFavouriteProducts(user.id);
      ///
      await Promise.all(
        previousLikedProducts.map(async (product) => {
          if (product.favorites.includes(userId)) {
            // user liked already
            return true;
          }
          /// save favorite
          const newFavorites = [...product.favorites, userId];
          await this.productModel.update(product.id, {
            favorites: newFavorites,
          });
          return true;
        })
      );

      const updatedUser = await this.userModel.update(userId, {
        retrieve_favourite: true,
      });

      if (!updatedUser) {
        return resolve({
          message: MESSAGES.FAVOURITE.FAILED_TO_RETRIEVE,
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
