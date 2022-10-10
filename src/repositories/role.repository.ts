import BaseRepository from "./base.repository";
import RoleModel, {RoleAttributes} from "@/model/role.model";

class RoleRepository extends BaseRepository<RoleAttributes> {
  protected model: RoleModel;
  protected DEFAULT_ATTRIBUTE: Partial<RoleAttributes> = {
    id: '',
    name: '',
  }

  constructor() {
    super();
    this.model = new RoleModel();
  }

}

export default RoleRepository;
export const roleRepository = new RoleRepository();
