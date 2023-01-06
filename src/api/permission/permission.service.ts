import { permissionRepository } from "@/repositories/permission.repository";
import { companyPermissionRepository } from "@/repositories/company_permission.repository";
import {
  TiscRoles,
  BrandRoles,
  DesignFirmRoles,
  RoleData,
  MESSAGES,
  DefaultPermission,
} from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import { mappingPermission } from "./permission.mapping";
import { UserAttributes, UserRole } from "@/types";
import { CompanyPermissionAttributes } from "@/model/company_permission.model";
import { isEmpty } from "lodash";

export default class PermissionService {
  public getList = async (user: UserAttributes, withRole: boolean = false) => {
    let companyPermissions =
      await companyPermissionRepository.getAllByCompanyIdAndRoleId(
        user.relation_id,
        withRole ? user.role_id : undefined
      );
    if (isEmpty(companyPermissions)) {
      await this.initPermission(user);
      companyPermissions =
        await companyPermissionRepository.getAllByCompanyIdAndRoleId(
          user.relation_id,
          withRole ? user.role_id : undefined
        );
    }
    return successResponse({
      data: mappingPermission(companyPermissions),
    });
  };

  public openClose = async (id: string) => {
    const companyPermission = await companyPermissionRepository.find(id);
    if (!companyPermission) {
      return errorMessageResponse(MESSAGES.PERMISSION_NOT_FOUND);
    }

    if (
      companyPermission.role_id === TiscRoles.Admin ||
      companyPermission.role_id === BrandRoles.Admin ||
      companyPermission.role_id === DesignFirmRoles.Admin
    ) {
      return errorMessageResponse(MESSAGES.PERMISSION.NO_MODIFY_ADMIN_PERM);
    }
    await companyPermissionRepository.update(id, {
      accessable: !companyPermission.accessable,
    });
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public initPermission = async (user: UserAttributes) => {
    const permissions = await permissionRepository.getAllBy({
      type: user.type,
    });
    const roles = RoleData[user.type] as UserRole[];
    const data: Partial<CompanyPermissionAttributes>[] = [];
    ///
    permissions.forEach((permission) => {
      roles.forEach((roleId) => {
        data.push({
          role_id: roleId,
          relation_id: user.relation_id,
          permission_id: permission.id,
          accessable: this.getRoleAccessable(roleId, permission.id),
        });
      });
    });
    await companyPermissionRepository.multipleInsert(data);
    return true;
  };

  private getRoleAccessable = (roleId: UserRole, permissionId: string) => {
    if (
      roleId === TiscRoles.Admin ||
      roleId === BrandRoles.Admin ||
      roleId === DesignFirmRoles.Admin
    ) {
      return true;
    }

    if (roleId === TiscRoles.Consultant) {
      return DefaultPermission.tisc_consultant_team.includes(permissionId);
    }
    if (roleId === BrandRoles.Member) {
      return DefaultPermission.brand_team.includes(permissionId);
    }
    if (roleId === DesignFirmRoles.Member) {
      return DefaultPermission.design_team.includes(permissionId);
    }
    return true;
  };
}

export const permissionService = new PermissionService();
