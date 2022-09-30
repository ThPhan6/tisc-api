import {permissionRepository} from '@/repositories/permission.repository';
import {companyPermissionRepository} from '@/repositories/company_permission.repository';
import {userRepository} from '@/repositories/user.repository';
import {
  ROLES,
  MESSAGES,
  ROLE_TYPE,
} from '@/constants';
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from '@/helper/response.helper';
import {mappingPermission} from './permission.mapping';
import {UserAttributes, RoleTypeValue} from '@/types';
import {CompanyPermissionAttributes} from '@/model/company_permission.model';
import {isEmpty} from 'lodash';

export default class PermissionService {

  private getRoles = (type: RoleTypeValue) => {

    if (type === ROLE_TYPE.TISC) {
      return [ROLES.TISC_ADMIN, ROLES.TISC_CONSULTANT_TEAM];
    }

    if (type === ROLE_TYPE.BRAND) {
      return [ROLES.BRAND_ADMIN, ROLES.BRAND_TEAM];
    }

    return [ROLES.DESIGN_ADMIN, ROLES.DESIGN_TEAM];
  }

  public getList = async (userId: string) => {

    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    let companyPermissions = await companyPermissionRepository.getAllByCompanyIdAndRoleId(user.relation_id);
    if (isEmpty(companyPermissions)) {
      await this.initPermission(user);
      companyPermissions = await companyPermissionRepository.getAllByCompanyIdAndRoleId(user.relation_id);
    }
    return successResponse({
      data: mappingPermission(companyPermissions)
    });
  }

  public openClose = async (id: string) => {

    const companyPermission = await companyPermissionRepository.find(id);
    if (!companyPermission) {
      return errorMessageResponse(MESSAGES.PERMISSION_NOT_FOUND);
    }
    if (
      companyPermission.role_id === ROLES.TISC_ADMIN ||
      companyPermission.role_id === ROLES.BRAND_ADMIN ||
      companyPermission.role_id === ROLES.DESIGN_ADMIN
    ) {
      return errorMessageResponse(MESSAGES.PERMISSION.NO_MODIFY_ADMIN_PERM);
    }

    await companyPermissionRepository.update(id, {
      accessable: !companyPermission.accessable
    });

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public initPermission = async (user: UserAttributes) => {
    const permissions = await permissionRepository.getAllBy({ type: user.type });
    const roles = this.getRoles(user.type);
    const data: Partial<CompanyPermissionAttributes>[] = [];
    ///
    permissions.forEach((permission) => {
      roles.forEach((roleId) => {
        data.push({
          role_id: roleId,
          relation_id: user.relation_id,
          permission_id: permission.id,
        });
      });
    });
    await companyPermissionRepository.multipleInsert(data);
    return true;
  }
}
export const permissionService = new PermissionService();
