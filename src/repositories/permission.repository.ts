import BaseRepository from "./base.repository";
import PermissionModel, {IPermissionAttributes} from "@/models/permission.model";

class PermissionRepository extends BaseRepository<IPermissionAttributes> {
  protected model: PermissionModel;
  protected DEFAULT_ATTRIBUTE: Partial<IPermissionAttributes> = {
    id: '',
    logo: null,
    name: '',
    routes: [],
    type: 1,
    parent_id: null,
  }

  constructor() {
    super();
    this.model = new PermissionModel();
  }

}

export default PermissionRepository;
export const permissionRepository = new PermissionRepository();
