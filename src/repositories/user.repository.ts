import UserModel from "@/model/user.models";
import BaseRepository from "./base.repository";
import { USER_STATUSES, ROLE_TYPE, SYSTEM_TYPE } from "@/constants";
import { SortOrder, UserAttributes } from "@/types";
import { head } from "lodash";
import { generateUniqueString } from "@/helper/common.helper";

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
    phone_code: "",
    phone: "",
    mobile: "",
    password: "",
    avatar: null,
    backup_email: "",
    personal_mobile: "",
    linkedin: "",
    is_verified: false,
    verification_token: null,
    reset_password_token: null,
    status: USER_STATUSES.PENDING,
    type: ROLE_TYPE.TISC,
    relation_id: "TISC",
    retrieve_favourite: false,
    interested: [],
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
      .where("status", "==", USER_STATUSES.ACTIVE)
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

  public generateToken = async (column: keyof UserAttributes) => {
    let token: string;
    let isDuplicated = true;
    do {
      token = generateUniqueString();
      const user = await this.findBy({ [column]: token });
      if (!user) isDuplicated = false;
    } while (isDuplicated);
    return token;
  };

  public getPagination = async (
    limit?: number,
    offset?: number,
    relationId?: string | null,
    sort?: any
  ) => {
    let query = this.getModel().getQuery();
    if (relationId) {
      query = query.where("relation_id", "==", relationId);
    }
    if (sort) {
      query = query.order(sort[0], sort[1]);
    }
    if (limit && offset) {
      query.limit(limit, offset);
      return await query.paginate();
    }
    const response = await query.get();
    const totalSize = (response.length ?? 0) as number;
    return {
      pagination: {
        total: totalSize,
        page: 1,
        page_size: totalSize,
        page_count: totalSize,
      },
      data: response,
    };
  };

  public getWithLocationAndDeparmentData = (relationId: string) => {
    const rawQuery = `
      FOR users IN users
        FILTER users.deleted_at == null
        FILTER users.relation_id == @relationId
        let locationData = (
          FOR locations IN locations
            FILTER locations.id == users.location_id
            FILTER locations.deleted_at == null
          RETURN UNSET(locations, ["_id","_key","_rev","deleted_at","deleted_by","is_deleted"])
        )
        let commontypeData = (
          FOR common_types IN common_types
            FILTER common_types.id == users.department_id
            FILTER common_types.deleted_at == null
          RETURN UNSET(common_types, ["_id","_key","_rev","deleted_at","deleted_by","is_deleted"])
        )
        SORT users._key DESC
      RETURN merge(
        users,
        {
          locations: locationData.length == 0 ? null : locationData[0],
          common_types: commontypeData.length == 0 ? null : commontypeData[0]
        }
    )`;

    return this.model.rawQueryV2(rawQuery, { relationId });
  };

  public async getTeamProfile(ids: string[], keySelect: string[]) {
    return this.model
      .select(...keySelect)
      .whereIn("id", ids)
      .get();
  }
}

export const userRepository = new UserRepository();

export default UserRepository;
