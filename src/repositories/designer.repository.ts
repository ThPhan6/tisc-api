import DesignerModel from "@/model/designer.models";
import BaseRepository from "./base.repository";
import {
  DesignerAttributes,
  ListDesignerWithPaginate,
  ProjectStatus,
} from "@/types";
import { DesignerDataCustom } from "@/api/designer/designer.type";
import { DesignFirmFunctionalType } from "@/api/location/location.type";

class DesignerRepository extends BaseRepository<DesignerAttributes> {
  protected model: DesignerModel;
  protected DEFAULT_ATTRIBUTE: Partial<DesignerAttributes> = {
    name: "",
    parent_company: "",
    logo: null,
    slogan: "",
    profile_n_philosophy: "",
    official_website: "",
    status: 1,
    capabilities: [],
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
    const params = {
      satelliteType: DesignFirmFunctionalType.Satellite,
      live: ProjectStatus.Live,
      onHold: ProjectStatus["On Hold"],
      archived: ProjectStatus.Archived,
    };
    const rawQuery = `
      ${limit || offset ? `LIMIT ${offset}, ${limit}` : ``}
      ${sort && order ? `SORT designers.${sort} ${order}` : ``}
      LET userCount = (
        FOR users IN users
        FILTER users.deleted_at == null
        FILTER users.relation_id == designers.id
        COLLECT WITH COUNT INTO length
        RETURN length
      )
      LET firmLocations = (
        FOR loc IN locations
        FILTER loc.deleted_at == null
        FILTER loc.relation_id == designers.id
        RETURN loc
      )
      LET satellitesCount = (
        FOR loc IN firmLocations
        FILTER @satelliteType IN loc.functional_type_ids
        COLLECT WITH COUNT INTO length
        RETURN length
      )
      LET projectStatus = (
        FOR p IN projects
        FILTER p.deleted_at == null
        FILTER p.design_id == designers.id
        RETURN p.status
      )

      RETURN MERGE(
        KEEP(designers, 'id', 'name', 'logo', 'status'), 
        {
          capacities: LENGTH(designers.capabilities),
          designers: userCount[0],
          origin: firmLocations[0].country_name,
          main_office: firmLocations[0].city_name,
          satellites: satellitesCount[0],
          projects: LENGTH(projectStatus),
          live: (FOR s IN projectStatus FILTER s == @live COLLECT WITH COUNT INTO length RETURN length)[0],
          on_hold: (FOR s IN projectStatus FILTER s == @onHold COLLECT WITH COUNT INTO length RETURN length)[0],
          archived: (FOR s IN projectStatus FILTER s == @archived COLLECT WITH COUNT INTO length RETURN length)[0],
        }
      )
    `;

    return (await this.model.rawQuery(
      rawQuery,
      params
    )) as DesignerDataCustom[];
  }

  public async getOne(id: string) {
    const designFirm = await this.model.rawQuery(
      `
      FILTER designers.id == @id
      LET capabilities = (
        FOR common_types IN common_types
        FILTER common_types.id IN designers.capabilities
        RETURN common_types.name
      )
      RETURN MERGE(
        KEEP(designers, 'id', 'logo', 'name', 'parent_company', 'profile_n_philosophy', 'slogan', 'status'),
        {design_capabilities: CONCAT_SEPARATOR(', ', capabilities)}
      )
    `,
      { id }
    );
    return designFirm[0];
  }

  public async getOverallSummary(): Promise<{
    project: {
      total: number;
      live: number;
      onHold: number;
      archived: number;
    };
    designFirm: {
      total: number;
      totalLocation: number;
      totalUser: number;
    };
    countries: {
      regions: string[];
      summary: {
        region: string;
        count: number;
      }[];
    };
  }> {
    const designFirm = await this.model.rawQueryV2(
      `
      LET designFirm = (
        FOR d in designers
        FILTER d.deleted_at == null

        LET loc = (
          FOR loc IN locations
          FILTER loc.relation_id == d.id
          FILTER loc.deleted_at == null
          LET country = (
            FOR c in countries
            FILTER c.id == loc.country_id
            RETURN c
          )
          RETURN MERGE(loc, {country: country[0]})
        )
        LET user = (
          FOR u IN users
          FILTER u.relation_id == d.id
          FILTER u.deleted_at == null
          COLLECT WITH COUNT INTO length
          RETURN length
        )


        RETURN { firm: d, loc, userCount: user[0] }
      )

      LET designLoc = (
        FOR ds IN designFirm
        RETURN ds.loc
      )
      LET locations = FLATTEN(designLoc)

      LET users = (
        FOR ds IN designFirm
        RETURN ds.userCount
      )

      LET regions = (
        FOR c IN countries
        FILTER c.region != ""
        RETURN DISTINCT c.region
      )
      LET countries = (
        FOR loc IN locations
        FILTER loc.country != null
        COLLECT group = loc.country.region INTO countryGroup
        RETURN {
          region: group,
          count: COUNT(countryGroup)
        }
      )

      LET prj = (
        FOR ds IN designFirm
        FOR p IN projects
        FILTER p.deleted_at == null
        FILTER p.design_id == ds.firm.id
        RETURN p
      )
      LET live = (
        FOR p IN prj
        FILTER p.status == @liveStatus
        COLLECT WITH COUNT INTO length
        RETURN length
      )
      LET onHold = (
        FOR p IN prj
        FILTER p.status == @onHoldStatus
        COLLECT WITH COUNT INTO length
        RETURN length
      )
      LET archived = (
        FOR p IN prj
        FILTER p.status == @archiveStatus
        COLLECT WITH COUNT INTO length
        RETURN length
      )

      RETURN {
        designFirm: {
          total: LENGTH(designFirm),
          totalLocation: LENGTH(locations),
          totalUser: SUM(users),
        },
        countries: {
          summary: countries,
          regions
        },
        project: {
          total: LENGTH(prj),
          live: live[0],
          onHold: onHold[0],
          archived: archived[0]
        },
      }
    `,
      {
        liveStatus: ProjectStatus.Live,
        onHoldStatus: ProjectStatus["On Hold"],
        archiveStatus: ProjectStatus.Archived,
      }
    );
    return designFirm[0];
  }
}
export const designerRepository = new DesignerRepository();
export default DesignerRepository;
