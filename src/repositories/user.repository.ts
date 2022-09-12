import UserModel from '@/model/user.models';
import BaseRepository from './base.repository';
import {SYSTEM_TYPE} from '@/constant/common.constant';
import {UserAttributes} from '@/types';

class UserRepository extends BaseRepository<UserAttributes> {
  protected model: UserModel;
  constructor() {
    super();
    this.model = new UserModel();
  }

  public async paginate() {
    return await this.model.where('id', '==', '123').paginate(5,5);
  }

  public async getAdminOfCompany(relationId: string) { /// getFirstBrandAdmin
    return await this.model
      .where('relation_id', '==', relationId)
      .first() as UserAttributes | undefined;
  }
  public async getTiscUsers() {
    return await this.model
      .where('type', '==', SYSTEM_TYPE.TISC)
      .get() as UserAttributes[];
  }
  public async getInactiveDesignFirmByBackupData(
    backupEmail: string,
    personalMobile: string
  ) {
    return await this.model
      .where('backup_email', '==', backupEmail)
      .where('personal_mobile', '==', personalMobile)
      .where('type', '==', SYSTEM_TYPE.DESIGN)
      .first() as UserAttributes | undefined;
  }

}

export default UserRepository;
