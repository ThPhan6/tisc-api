import Model from "@/Database/Model";
import {ProductFavouriteAttributes} from '@/types';

export default class ProductFavouriteModel extends Model<ProductFavouriteAttributes> {
  protected table = 'product_favourites';
}
