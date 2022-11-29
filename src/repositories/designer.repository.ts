import DesignerModel from "@/model/designer.model";
import BaseRepository from "./base.repository";
import {
  CustomProductAttributes,
  CustomResouceType,
  DesignerAttributes,
  DesignFirmFunctionalType,
  ListDesignerWithPaginate,
  LocationType,
  ProjectStatus,
  SortOrder,
  UserStatus,
} from "@/types";
import {
  DesignerDataCustom,
  GetDesignFirmSort,
} from "@/api/designer/designer.type";
import { getUnsetAttributes } from "@/helper/common.helper";
import { locationRepository } from "./location.repository";

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
    sort: GetDesignFirmSort,
    order: SortOrder = "ASC"
  ) {
    const params = {
      satelliteType: DesignFirmFunctionalType.SatelliteOffice,
      live: ProjectStatus.Live,
      onHold: ProjectStatus["On Hold"],
      archived: ProjectStatus.Archived,
      activeStatus: UserStatus.Active,
      designLocation: LocationType.designer,
    };
    const rawQuery = `

      LET userCount = (
        FOR users IN users
        FILTER users.deleted_at == null
        FILTER users.status == @activeStatus
        FILTER users.relation_id == designers.id
        COLLECT WITH COUNT INTO length
        RETURN length
      )
      LET firmLocations = (
        FOR loc IN locations
        FILTER loc.deleted_at == null
        FILTER loc.relation_id == designers.id
        FILTER loc.type == @designLocation
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

      ${sort === "origin" ? `SORT firmLocations[0].country_name ${order}` : ""}
      ${
        sort === "main_office" ? `SORT firmLocations[0].city_name ${order}` : ""
      }
      ${
        sort === "created_at" || sort === "name"
          ? `SORT designers.${sort} ${order}`
          : ""
      }
      ${limit || offset ? `LIMIT ${offset}, ${limit}` : ``}
      RETURN MERGE(
        KEEP(designers, 'id', 'name', 'logo', 'status', 'created_at'),
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
      FILTER designers.deleted_at == null
      LET capabilities = (
        FOR common_types IN common_types
        FILTER common_types.deleted_at == null
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
          FILTER loc.type == @designLocation
          FILTER loc.deleted_at == null
          LET country = (
            FOR c in countries
            FILTER c.deleted_at == null
            FILTER c.id == loc.country_id
            RETURN c
          )
          RETURN MERGE(loc, {country: country[0]})
        )
        LET user = (
          FOR u IN users
          FILTER u.relation_id == d.id
          FILTER u.deleted_at == null
          FILTER u.status == @activeStatus
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
        FILTER c.deleted_at == null
        RETURN DISTINCT c.region
      )
      LET countries = (
        FOR loc IN locations
        FILTER loc.country != null
        FILTER loc.deleted_at == null
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
        activeStatus: UserStatus.Active,
        designLocation: LocationType.designer,
      }
    );
    return designFirm[0];
  }

  public async getLibrary(
    designId: string
  ): Promise<{ products: CustomProductAttributes[] }> {
    const result = await this.model.rawQueryV2(
      `
      LET brands = (
        FOR b IN custom_resources
        FILTER b.deleted_at == null
        FILTER b.design_id == @designId
        FILTER b.type == @brandType
        FOR loc IN locations
        FILTER loc.id == b.location_id
        FILTER loc.deleted_at == null
        RETURN MERGE(
          ${getUnsetAttributes("b")},
          KEEP(loc, ${locationRepository.basicAttributesQuery})
        )
      )

      LET distributors = (
        FOR b IN custom_resources
        FILTER b.deleted_at == null
        FILTER b.design_id == @designId
        FILTER b.type == @distributorType
        FOR loc IN locations
        FILTER loc.id == b.location_id
        FILTER loc.deleted_at == null
        RETURN MERGE(
          ${getUnsetAttributes("b")},
          KEEP(loc, ${locationRepository.basicAttributesQuery})
        )
      )

      LET products = (
        FOR p IN custom_products
        FILTER p.design_id == @designId
        FILTER p.deleted_at == null
        FOR b IN brands
        FILTER b.id == p.company_id
        FOR col IN collections
        FILTER col.id == p.collection_id
        RETURN MERGE(${getUnsetAttributes(
          "p",
          `'images'`
        )}, {company_name: b.business_name, collection_name: col.name })
      )

      LET collections = (
        FOR p IN products
        COLLECT collection_id = p.collection_id, collection_name = p.collection_name  INTO group
        RETURN {
          id: collection_id,
          name: collection_name,
          products: (FOR g IN group RETURN MERGE(KEEP(g.p, 'id', 'name'), {image: FIRST(g.p.images)}))
        }
      )

      RETURN { brands, distributors, collections, products }
    `,
      {
        designId,
        brandType: CustomResouceType.Brand,
        distributorType: CustomResouceType.Distributor,
      }
    );
    return result[0];
  }
}
export const designerRepository = new DesignerRepository();
export default DesignerRepository;
