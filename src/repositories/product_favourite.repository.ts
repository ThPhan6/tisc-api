import ProductFavouriteModel from '@/model/product_favourite.model';
import BaseRepository from './base.repository';
import {ProductFavouriteAttributes} from '@/types';
import {isEmpty} from 'lodash';

class ProductFavouriteRepository extends BaseRepository<ProductFavouriteAttributes> {
  protected model: ProductFavouriteModel;
  protected DEFAULT_ATTRIBUTE: Partial<ProductFavouriteAttributes> = {
    product_id: '',
    created_by: '',
  }
  constructor() {
    super();
    this.model = new ProductFavouriteModel();
  }

  public async like(productId: string, createdBy: string) {
    return this.create({ product_id: productId, created_by: createdBy });
  }

  public async unlike(productId: string, createdBy: string) {
    return this.model
      .where('product_id', '==', productId)
      .where('created_by', '==', createdBy)
      .delete();
  }

  public async isLikingProduct(productId: string, createdBy: string) {
    const response = await this.model
      .where('product_id', '==', productId)
      .where('created_by', '==', createdBy)
      .first();
      if (isEmpty(response)) {
        return false;
      }
      return true;
  }

}

export default ProductFavouriteRepository;
