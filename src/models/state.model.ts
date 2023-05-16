import Model from "@/Database/Model";
import {IStateAttributes} from '@/types';

export default class StateModel extends Model<IStateAttributes> {
  protected table = 'states';
  protected softDelete = true;
}
