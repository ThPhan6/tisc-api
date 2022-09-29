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
        LET users = (
          FOR users IN users
          FILTER users.relation_id == designers.id
          RETURN users
        )
        
        LET assignTeams = (
          FOR assignTeam IN users
          FOR profileId IN designers.team_profile_ids
          FILTER assignTeam.id == profileId
          RETURN assignTeam
        )

        LET originLocation = (
          FOR locations IN locations
          FILTER locations.id == FIRST(designers.location_ids || [])
          RETURN locations
        )

        LET projects = (
          FOR projects IN projects
          RETURN projects
        )



        RETURN MERGE ({
          designer : designers,
          users : LENGTH(users),
          origin_location : originLocation,
          projects : projects,
          assign_team : assignTeams
        })
`;
    console.log(rawQuery, "[rawQuery]");

    return this.model.rawQuery(rawQuery, params);
  }
}
export const designerRepository = new DesignerRepository();
export default DesignerRepository;
