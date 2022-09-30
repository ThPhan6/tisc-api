import BaseRepository from "./base.repository";
import CompanyPermissionModel, {CompanyPermissionAttributes} from "@/model/company_permission.model";
import {CompanyPermissionWithInfo} from '@/types';

class CompanyPermissionRepository extends BaseRepository<CompanyPermissionAttributes> {
  protected model: CompanyPermissionModel;
  protected DEFAULT_ATTRIBUTE: Partial<CompanyPermissionAttributes> = {
    id: '',
    role_id: '',
    relation_id: '',
    permission_id: '',
    accessable: true
  }

  constructor() {
    super();
    this.model = new CompanyPermissionModel();
  }

  public getAllByCompanyIdAndRoleId = async (relationId: string | null, roleId?: string) => {
    let query = this.getModel().select(
      'company_permissions.*',
      'permissions.logo as logo',
      'permissions.name as name',
      'permissions.parent_id as parent_id'
    )
    .join('permissions', 'permissions.id', '==', 'company_permissions.permission_id')
    .where('company_permissions.relation_id', '==', relationId);

    if (roleId) {
      query = query.where('company_permissions.role_id', '==', roleId);
    }
    return await query.get() as CompanyPermissionWithInfo[];
  }

  public multipleInsert = (data: Partial<CompanyPermissionAttributes>[]) => {
    return this.getModel().insert(data);
  }
}

export default CompanyPermissionRepository;
export const companyPermissionRepository = new CompanyPermissionRepository();
