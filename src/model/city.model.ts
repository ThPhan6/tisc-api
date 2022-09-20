import Model from "@/Database/Model";
import {ICityAttributes} from '@/types';

export default class CityModel extends Model<ICityAttributes> {
  protected table = 'cities';
  protected softDelete = true;
}
