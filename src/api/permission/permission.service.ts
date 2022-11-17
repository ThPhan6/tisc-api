import { permissionRepository } from "@/repositories/permission.repository";
import { companyPermissionRepository } from "@/repositories/company_permission.repository";
import {
  TiscRoles, BrandRoles, DesignFirmRoles,
  RoleData, MESSAGES
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

    if (
      companyPermission.permission_id === "permission_13_0" &&
      companyPermission.accessable === true
    ) {
      // project overal listing
      await companyPermissionRepository
        .getModel()
        .whereIn("permission_id", [
          "permission_13_0",
          "permission_13_1",
          "permission_13_2",
          "permission_13_3",
          "permission_13_4",
        ])
        .where("relation_id", "==", companyPermission.relation_id)
        .where("role_id", "==", companyPermission.role_id)
        .update({
          accessable: false,
        });
    } else {
      await companyPermissionRepository.update(id, {
        accessable: !companyPermission.accessable,
      });
    }

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
          accessable: this.getRoleAccessable(roleId, permission.name),
        });
      });
    });
    await companyPermissionRepository.multipleInsert(data);
    return true;
  };

  private getRoleAccessable = (roleId: UserRole, permissionName: string) => {
    if (
      roleId === TiscRoles.Admin ||
      roleId === BrandRoles.Admin ||
      roleId === DesignFirmRoles.Admin
    ) {
      return true;
    }

    if (roleId === TiscRoles.Consultant) {
      const noAdminAccessable = [
        "Brands",
        "Design Firms",
        "Listing",
        "Categories",
        "Documentation",
        "Locations",
        "Team Profiles",
        "Messages",
        "Revenues",
      ];
      if (!noAdminAccessable.includes(permissionName)) {
        return true;
      }
    }
    if (roleId === BrandRoles.Member) {
      const noBrandAccessable = [
        "Brand Profile",
        "Locations",
        "Team Profiles",
        "Distributors",
        "Market Availability",
        "Subscription",
      ];
      if (!noBrandAccessable.includes(permissionName)) {
        return true;
      }
    }
    if (roleId === DesignFirmRoles.Member) {
      const noDesignAccessable = [
        "Office Profile",
        "Locations",
        "Team Profiles",
        "Material/Product Code",
      ];
      if (!noDesignAccessable.includes(permissionName)) {
        return true;
      }
    }

    return false;
  };
}
export const permissionService = new PermissionService();
