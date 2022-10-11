import productRepository from '@/repositories/product.repository';
import {userRepository} from '@/repositories/user.repository';
import {locationRepository} from '@/repositories/location.repository';
import {productFavouriteRepository} from '@/repositories/product_favourite.repository';
import { MESSAGES } from "@/constants";
import {UserAttributes} from '@/types';
import {successMessageResponse, errorMessageResponse} from '@/helper/response.helper';
import {isEmpty} from 'lodash';

export default class FavouriteService {

  public skip = async (user: UserAttributes) => {

    if (user.retrieve_favourite) {
      return errorMessageResponse(MESSAGES.FAVOURITE.ALREADY_SKIPPED);
    }

    const updatedUser = await userRepository.update(user.id, {
      retrieve_favourite: true,
    });

    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.FAVOURITE.FAILED_TO_SKIP);
    }
    return successMessageResponse(MESSAGES.SUCCESS);

  };

  public retrieve = async (
    backupEmail: string,
    personalMobile: string,
    phone_code: string,
    user: UserAttributes
  ) => {

    const backupUser = await userRepository.getInactiveDesignFirmByBackupData(backupEmail, personalMobile);
    const location = await locationRepository.find(backupUser?.location_id || "");

    if ( !backupUser || (location && location.phone_code !== phone_code) ) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    if (user.retrieve_favourite) {
      return errorMessageResponse(MESSAGES.FAVOURITE.ALREADY_RETRIEVED);
    }

    const previousLikedProducts = await productRepository.getUserFavouriteProducts(backupUser.id);

    const favouriteData = previousLikedProducts.map((product) => {
      return { product_id: product.id, created_by: user.id }
    });

    if (!isEmpty(favouriteData)) {
      await productFavouriteRepository.getModel().insert(favouriteData);
    }
    
    const updatedUser = await userRepository.update(user.id, {
      retrieve_favourite: true,
    });

    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.FAVOURITE.FAILED_TO_RETRIEVE);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const favouriteService = new FavouriteService();
