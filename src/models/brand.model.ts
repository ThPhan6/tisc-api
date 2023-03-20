import Model from "@/Database/Model";
import {BrandAttributes} from '@/types';

export default class BrandModel extends Model<BrandAttributes> {
  protected table = 'brands';
  protected softDelete = true;
}
