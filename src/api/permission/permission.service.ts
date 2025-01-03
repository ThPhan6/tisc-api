import { permissionRepository } from "@/repositories/permission.repository";
import { companyPermissionRepository } from "@/repositories/company_permission.repository";
import {
  TiscRoles,
  BrandRoles,
  DesignFirmRoles,
  RoleData,
  MESSAGES,
  DefaultPermission,
  RoleNames,
  PartnerRoles,
} from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { mappingPermission } from "./permission.mapping";
import { UserAttributes, UserRole, UserType } from "@/types";
import { CompanyPermissionAttributes } from "@/models/company_permission.model";
import { isEmpty } from "lodash";
import { ActivityTypes, logService } from "@/services/log.service";

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

    /// add permission for brand partner
    if (user.type === UserType.Brand) {
      companyPermissions = companyPermissions.concat(companyPermissions);
    }

    return successResponse({
      data: mappingPermission(companyPermissions),
    });
  };

  public openClose = async (id: string, user: UserAttributes, path: string) => {
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
    logService.create(ActivityTypes.enabled_permission, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: {
        permission_id: id,
        role_name: RoleNames[companyPermission.role_id],
        action: companyPermission.accessable === true ? "Disabled" : "Enabled",
      },
    });
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public initPermission = async (user: UserAttributes) => {
    const permissions = await permissionRepository.getAllBy({
      type: user.type === UserType.Partner ? UserType.Brand : user.type,
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
    if (roleId === PartnerRoles.Admin) {
      return DefaultPermission.partner_admin.includes(permissionId);
    }
    return false;
  };
}

export const permissionService = new PermissionService();
