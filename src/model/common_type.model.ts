import Model from "@/Database/Model";
import {CommonTypeAttributes} from '@/types';

export default class CommonTypeModel extends Model<CommonTypeAttributes> {
  protected table = 'common_types';
  protected softDelete = true;
}
