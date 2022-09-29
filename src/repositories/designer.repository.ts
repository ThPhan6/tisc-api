import DesignerModel from "@/model/designer.models";
import BaseRepository from "./base.repository";
import { DesignerAttributes, ListDesignerWithPaginate } from "@/types";

class DesignerRepository extends BaseRepository<DesignerAttributes> {
  protected model: DesignerModel;
  protected DEFAULT_ATTRIBUTE: Partial<DesignerAttributes> = {
    name: "",
    parent_company: "",
    logo: null,
    slogan: "",
    profile_n_philosophy: "",
    official_website: "",
    team_profile_ids: [],
    status: 1,
  };

  constructor() {
    super();
    this.model = new DesignerModel();
  }

  public async getListDesignerWithPagination(
    limit: number,
    offset: number,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    if (sort && order) {
      return (await this.model
        .select()
        .order(sort, order)
        .paginate(limit, offset)) as ListDesignerWithPaginate;
    }

    return (await this.model
      .select()
      .order(sort, order)
      .paginate(limit, offset)) as ListDesignerWithPaginate;
  }

  public async getListDesignerCustom(
    limit: number,
    offset: number,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    const params = {} as any;
    const rawQuery = `
      ${limit && offset ? `LIMIT ${offset}, ${limit}` : ``}
      ${sort && order ? `SORT designers.${sort} ${order}` : ``}
      FILTER designers.deleted_at == null

        LET assignTeams = (
          FOR profileId IN designers.team_profile_ids
          FOR assignTeam IN users
          FILTER assignTeam.deleted_at == null
          FILTER assignTeam.id == profileId
          RETURN UNSET(assignTeam, [
            '_id', 
            '_key', 
            '_rev', 
            'deleted_at', 'deleted_by','access_level',
            'backup_email',
            'created_at',
            'department_id',
            'gender',
            'interested',
            'is_verified',
            'linkedin',
            'location_id',
            'mobile',
            'password',
            'personal_mobile',
            'phone',
            'position',
            'relation_id',
            'reset_password_token',
            'retrieve_favourite',
            'role_id',
            'status',
            'type',
            'verification_token',
            'work_location'
          ])
        )

        LET users = (
          FOR users IN users
          FILTER users.deleted_at == null
          FILTER users.relation_id == designers.id
          RETURN users
        )
        
        LET originLocation = (
          FOR locations IN locations
          FILTER locations.deleted_at == null
          FILTER locations.id == FIRST(designers.location_ids || [])
          RETURN locations
        )

        LET projects = (
          FOR projects IN projects
          FILTER projects.deleted_at == null
          RETURN projects
        )

        RETURN MERGE ({
          designer : designers,
          users : LENGTH(users),
          origin_location : originLocation,
          projects : projects,
          assign_team : assignTeams,
        })
`;

    return this.model.rawQuery(rawQuery, params);
  }
}
export const designerRepository = new DesignerRepository();
export default DesignerRepository;
