import Model from "@/Database/Model";
import {DesignerAttributes} from '@/types';

export default class DesignerModel extends Model<DesignerAttributes> {
  protected table = 'designers';
  protected softDelete = true;
}
