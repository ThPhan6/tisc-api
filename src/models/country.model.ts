import Model from "@/Database/Model";
import {ICountryAttributes} from '@/types';

export default class CountryModel extends Model<ICountryAttributes> {
  protected table = 'countries';
  protected softDelete = true;
}
