import UserModel from "@/models/user.model";
import BaseRepository from "./base.repository";
import {
  ActiveStatus,
  SortOrder,
  UserAttributes,
  ILocationAttributes,
  CommonTypeAttributes,
  UserStatus,
  UserType,
} from "@/types";
import { DesignFirmRoles } from "@/constants";
import { head, isNumber } from "lodash";
import { generateUniqueString } from "@/helpers/common.helper";

class UserRepository extends BaseRepository<UserAttributes> {
  protected model: UserModel;
  protected DEFAULT_ATTRIBUTE: Partial<UserAttributes> = {
    role_id: DesignFirmRoles.Member,
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
    personal_phone_code: "",
    linkedin: "",
    is_verified: false,
    verification_token: null,
    reset_password_token: null,
    status: UserStatus.Pending,
    type: UserType.TISC,
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
      .where("type", "==", UserType.TISC)
      .where("status", "==", UserStatus.Active)
      .get()) as UserAttributes[];
  }
  public async getByTypeRoleAndRelation(
    type: UserType,
    role: string,
    relation_id?: string
  ) {
    return (await this.model
      .where("type", "==", type)
      .where("role_id", "==", role)
      .where("relation_id", "==", relation_id || "TISC")
      .where("status", "==", UserStatus.Active)
      .join("locations", "locations.id", "==", "users.location_id")
      .get()) as UserAttributes[];
  }
  public async getInactiveDesignFirmByBackupData(
    backupEmail: string,
    personalMobile: string
  ) {
    return (await this.model
      .where("backup_email", "==", backupEmail)
      .where("personal_mobile", "==", personalMobile)
      .where("type", "==", UserType.Designer)
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
        FILTER LOWER(users.email) == @email
        FILTER users.deleted_at == null
        LET brands = (
          FOR brand IN brands
          FILTER brand.deleted_at == null
          FILTER brand.id == users.relation_id
          RETURN {status: brand.status}
        )
        LET designs = (
          FOR design IN designers
          FILTER design.deleted_at == null
          FILTER design.id == users.relation_id
          RETURN {status: design.status}
        )
        RETURN MERGE(users, {
          company_status: LENGTH(brands) > 0 ? brands[0].status : (LENGTH(designs) > 0 ? designs[0].status : 0)
        })
      `,
      { email }
    )) as (UserAttributes & { company_status: ActiveStatus })[];
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

  public checkTokenExisted = async (token: string) => {
    const user = await this.model
      .where("reset_password_token", "==", token)
      .orWhere("verification_token", "==", token)
      .first() as UserAttributes | undefined;
    return user ? true : false;
  }

  public getPagination = async (
    limit?: number,
    offset?: number,
    relationId?: string | null,
    sort?: string,
    order?: SortOrder
  ) => {
    const params: any = {};
    if (relationId) {
      params.relationId = relationId;
    }
    params.sortOrder = order || "DESC";

    let query = `
      For user in users
        filter user.deleted_at == null
        ${relationId ? ` filter user.relation_id == @relationId ` : ""}
        For role in roles
          filter role.deleted_at == null
          filter role.id == user.role_id
        For location in locations
          filter location.deleted_at == null
          filter location.id == user.location_id
        LET work_location = location.city_name ? CONCAT(location.city_name, ', ', location.country_name) : location.country_name
        LET status = (user.status == ${
          UserStatus.Active
        } ? 'Activated' : (user.status == ${
      UserStatus.Blocked
    } ? 'Blocked' : 'Pending'))
     `;

    if (sort === "work_location" || sort === "status") {
      query += ` sort ${sort} @sortOrder `;
    } else if (sort === "access_level") {
      query += ` sort role.name @sortOrder `;
    } else {
      query += ` sort user.${sort} @sortOrder `;
    }

    if (isNumber(limit) && isNumber(offset)) {
      let totalRecords = await this.model.rawQueryV2(
        `${query} COLLECT WITH COUNT INTO length RETURN length`,
        params
      );
      totalRecords = (head(totalRecords) ?? 0) as number;
      query += ` LIMIT ${offset}, ${limit} `;
      query += `return merge(
          KEEP(user, 'id','firstname','lastname','fullname','position','email','phone','status','avatar','created_at'),
          {
              work_location: work_location,
              phone_code: location.phone_code,
              access_level: role.name
          }
      )`;
      const result = await this.model.rawQueryV2(query, params);
      return {
        pagination: {
          page: offset / limit + 1,
          page_size: limit,
          total: totalRecords,
          page_count: Math.ceil(totalRecords / limit),
        },
        data: result,
      };
    }
    query += `return merge(
        KEEP(user, 'id','firstname','lastname','fullname','position','email','phone','status','avatar','created_at'),
        {
            work_location: work_location,
            phone_code: location.phone_code,
            access_level: role.name
        }
    )`;
    const response = await this.model.rawQueryV2(query, params);
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

  public getWithLocationAndDeparmentData = async (relationId: string) => {
    const rawQuery = `
      FOR users IN users
        FILTER users.deleted_at == null
        FILTER users.relation_id == @relationId
        FILTER users.status == @userStatus
        FOR locations IN locations
          FILTER locations.id == users.location_id
          FILTER locations.deleted_at == null
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
          locations: UNSET(locations, ["_id","_key","_rev","deleted_at","deleted_by","is_deleted"]),
          common_types: commontypeData.length == 0 ? null : commontypeData[0]
        }
    )`;

    return (await this.model.rawQueryV2(rawQuery, {
      relationId,
      userStatus: UserStatus.Active,
    })) as (UserAttributes & {
      locations: ILocationAttributes;
      common_types?: CommonTypeAttributes;
    })[];
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
