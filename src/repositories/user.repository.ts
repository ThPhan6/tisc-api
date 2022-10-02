import UserModel from "@/model/user.models";
import BaseRepository from "./base.repository";
import { USER_STATUSES, ROLE_TYPE, SYSTEM_TYPE } from "@/constants";
import { UserAttributes } from "@/types";
import { head } from "lodash";

class UserRepository extends BaseRepository<UserAttributes> {
  protected model: UserModel;
  protected DEFAULT_ATTRIBUTE: Partial<UserAttributes> = {
    role_id: "",
    firstname: "",
    lastname: "",
    gender: true,
    location_id: null,
    work_location: null,
    department_id: null,
    position: "",
    email: "",
    phone: "",
    mobile: "",
    password: "",
    avatar: null,
    backup_email: "",
    personal_mobile: "",
    is_verified: false,
    verification_token: null,
    reset_password_token: null,
    status: USER_STATUSES.PENDING,
    type: ROLE_TYPE.TISC,
    relation_id: null,
    retrieve_favourite: false,
  };
  constructor() {
    super();
    this.model = new UserModel();
  }

  public async getAdminOfCompany(relationId: string) {
    /// getFirstBrandAdmin
    return (await this.model.where("relation_id", "==", relationId).first()) as
      | UserAttributes
      | undefined;
  }
  public async countUserOfCompany(relationId: string) {
    return this.model.where("relation_id", "==", relationId).count();
  }
  public async countUserInLocation(locationId: string) {
    return this.model.where("location_id", "==", locationId).count();
  }
  public async getTiscUsers() {
    return (await this.model
      .where("type", "==", SYSTEM_TYPE.TISC)
      .get()) as UserAttributes[];
  }
  public async getInactiveDesignFirmByBackupData(
    backupEmail: string,
    personalMobile: string
  ) {
    return (await this.model
      .where("backup_email", "==", backupEmail)
      .where("personal_mobile", "==", personalMobile)
      .where("type", "==", SYSTEM_TYPE.DESIGN)
      .first()) as UserAttributes | undefined;
  }

  public async getResendEmail(email: string) {
    return (await this.model
      .where("email", "==", email)
      .where("reset_password_token", "!=", null)
      .orWhere("verification_token", "!=", null)
      .first()) as UserAttributes | undefined;
  }

  public async findByCompanyIdWithCompanyStatus(email: string) {
    const result = (await this.model.rawQuery(
      `
        FILTER users.email == @email
        FILTER users.deleted_at == null
            let brands = (FOR brand in brands FILTER brand.id == users.relation_id RETURN {status: brand.status})
            let designs = (FOR design in designers FILTER design.id == users.relation_id RETURN {status: design.status})
        RETURN MERGE(users, {
          company_status: LENGTH(brands) > 0 ? brands[0].status : (LENGTH(designs) > 0 ? designs[0].status : 0)
        })
      `,
      { email }
    )) as (UserAttributes & { company_status: number })[];
    return head(result);
  }

  public async getTeamProfile() {}
}

export const userRepository = new UserRepository();

export default UserRepository;
