import BaseRepository from "./base.repository";
import CompanyPermissionModel, {
  CompanyPermissionAttributes,
} from "@/model/company_permission.model";
import { CompanyPermissionWithInfo } from "@/types";
import { DesignFirmRoles } from "@/constants";

class CompanyPermissionRepository extends BaseRepository<CompanyPermissionAttributes> {
  protected model: CompanyPermissionModel;
  protected DEFAULT_ATTRIBUTE: Partial<CompanyPermissionAttributes> = {
    id: "",
    role_id: DesignFirmRoles.Member,
    relation_id: "",
    permission_id: "",
    accessable: true,
  };

  constructor() {
    super();
    this.model = new CompanyPermissionModel();
  }

  public getAllByCompanyIdAndRoleId = async (
    relationId: string | null,
    roleId?: string
  ) => {
    let query = this.getModel()
      .select(
        "company_permissions.*",
        "permissions.logo as logo",
        "permissions.name as name",
        "permissions.parent_id as parent_id"
      )
      .join(
        "permissions",
        "permissions.id",
        "==",
        "company_permissions.permission_id"
      )
      .where("company_permissions.relation_id", "==", relationId)
      .order("permissions.index", "ASC");

    if (roleId) {
      query = query.where("company_permissions.role_id", "==", roleId);
    }
    return (await query.get()) as CompanyPermissionWithInfo[];
  };
  public findByRouteRoleIdAndRelationId = async (
    route: string,
    roleId: string,
    relationId: string | null
  ) => {
    const result = await this.model.rawQueryV2(
      `
      for company_permissions in (for ps in permissions
        for cps in company_permissions
               filter cps.permission_id == ps.id && ps.routes any == @route
   return cps) 
   filter company_permissions.role_id == @roleId && company_permissions.relation_id == @relationId && company_permissions.accessable == true
   return company_permissions
    `,
      { route, relationId, roleId }
    );
    return result[0];
  };

  public multipleInsert = (data: Partial<CompanyPermissionAttributes>[]) => {
    return this.getModel().insert(data);
  };
}

export default CompanyPermissionRepository;
export const companyPermissionRepository = new CompanyPermissionRepository();
