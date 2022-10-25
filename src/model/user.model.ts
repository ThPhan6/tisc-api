import Model from "@/Database/Model";
import {UserAttributes} from '@/types';

export default class UserModel extends Model<UserAttributes> {
  protected table = 'users';
  protected softDelete = true;
}
