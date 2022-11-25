import { locationService } from "./../location/location.service";
import { BRAND_STATUSES, MESSAGES, BrandRoles, ALL_REGIONS } from "@/constants";
import { pagination } from "@/helper/common.helper";
import { createResetPasswordToken } from "@/helper/password.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { userRepository } from "@/repositories/user.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { uploadLogoBrand } from "@/service/image.service";
import { mailService } from "@/service/mail.service";
import { permissionService } from "@/api/permission/permission.service";
import {
  ActiveStatus,
  BrandAttributes,
  SortOrder,
  SummaryInfo,
  UserStatus,
  UserAttributes,
  GetUserGroupBrandSort,
  UserType,
} from "@/types";
import { mappingBrands, mappingBrandsAlphabet } from "./brand.mapping";
import { IBrandRequest, IUpdateBrandProfileRequest } from "./brand.type";
import { v4 } from "uuid";
import { sumBy } from "lodash";

class BrandService {
  private async getOfficialWebsites(brand: BrandAttributes) {
    return Promise.all(
      brand.official_websites.map(async (officialWebsite) => {
        const country = await countryStateCityService.getCountryDetail(
          officialWebsite.country_id
        );
        return {
          ...officialWebsite,
          country_name:
            officialWebsite.country_id === "-1" ? "Global" : country.name,
        };
      })
    );
  }

  public async getList(
    limit: number,
    offset: number,
    _filter: any,
    sort: GetUserGroupBrandSort,
    order: SortOrder,
    haveProduct?: boolean
  ) {
    const dataBrandCustom = await brandRepository.getListBrandCustom(
      limit,
      offset,
      sort,
      order,
      haveProduct
    );

    const totalBrand = await brandRepository.getModel().count();

    const result = mappingBrands(dataBrandCustom);

    return successResponse({
      data: {
        brands: result,
        pagination: pagination(limit, offset, totalBrand),
      },
    });
  }

  public async getAllByAlphabet() {
    const allBrand = await brandRepository.getAllAndSortByName();

    let result = mappingBrandsAlphabet(allBrand);

    return successResponse({
      data: result,
    });
  }

  public async getOne(id: string) {
    const brand = await brandRepository.find(id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    const officialWebsites = await this.getOfficialWebsites(brand);

    return successResponse({
      data: { ...brand, official_websites: officialWebsites },
    });
  }

  public async invite(currentUser: UserAttributes, id: string) {
    const brand = await brandRepository.find(id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    if (brand.status !== BRAND_STATUSES.PENDING) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED);
    }

    const inviteUser = await userRepository.getAdminOfCompany(brand.id);

    if (!inviteUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    await mailService.sendInviteEmailTeamProfile(inviteUser, currentUser);

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getListCard(_filter: any, sort: string, order: SortOrder) {
    const brands = await brandRepository.getAllBrandsWithSort(sort, order);
    return successResponse({
      data: brands,
    });
  }

  public async updateBrandProfile(
    user: UserAttributes,
    payload: IUpdateBrandProfileRequest
  ) {
    if (user.type !== UserType.Brand || !user.relation_id) {
      return errorMessageResponse(MESSAGES.BRAND.NOT_IN_BRAND);
    }

    const brand = await brandRepository.find(user.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const updatedBrand = await brandRepository.update(brand.id, payload);
    if (!updatedBrand) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: {
        id: brand.id,
        name: updatedBrand.name,
        parent_company: updatedBrand.parent_company || "",
        logo: updatedBrand.logo,
        slogan: updatedBrand.slogan || "",
        mission_n_vision: updatedBrand.mission_n_vision || "",
        official_websites: updatedBrand.official_websites,
      },
    });
  }

  public async updateLogo(user: UserAttributes, logo: any) {
    if (user.type !== UserType.Brand || !user.relation_id) {
      return errorMessageResponse(MESSAGES.BRAND.NOT_IN_BRAND);
    }

    const brand = await brandRepository.find(user.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    if (!logo._data) {
      return errorMessageResponse(MESSAGES.IMAGE.LOGO_NOT_VALID);
    }

    const urlUploadedLogo = await uploadLogoBrand(logo, brand);

    return successResponse({
      data: {
        url: "/brand-logo/" + urlUploadedLogo,
      },
    });
  }

  public async create(payload: IBrandRequest) {
    const brand = await brandRepository.findBy({
      name: payload.name,
    });

    if (brand) {
      return errorMessageResponse(MESSAGES.BRAND_EXISTED);
    }
    const user = await userRepository.findBy({
      email: payload.email,
    });

    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_ALREADY_USED);
    }

    const createdBrand = await brandRepository.create({
      name: payload.name,
      status: BRAND_STATUSES.PENDING,
    });

    if (!createdBrand) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const defaultLocation = await locationService.createDefaultLocation(
      createdBrand.id,
      UserType.Brand,
      payload.email
    );

    let verificationToken: string;
    let isDuplicated = true;

    do {
      verificationToken = createResetPasswordToken();
      const duplicateVerificationTokenFromDb = await userRepository.findBy({
        verification_token: verificationToken,
      });
      if (!duplicateVerificationTokenFromDb) isDuplicated = false;
    } while (isDuplicated);

    const createdUser = await userRepository.create({
      firstname: payload.first_name,
      lastname: payload.last_name,
      gender: true,
      email: payload.email,
      role_id: BrandRoles.Admin,
      verification_token: verificationToken,
      is_verified: false,
      status: UserStatus.Pending,
      type: UserType.Brand,
      relation_id: createdBrand.id,
      location_id: defaultLocation?.id,
    });
    if (!createdUser) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    //create brand permissions
    await permissionService.initPermission(createdUser);

    const officialWebsites = this.getOfficialWebsites(createdBrand);

    return successResponse({
      data: { ...createdBrand, official_websites: officialWebsites },
    });
  }

  public async getBrandsSummary() {
    const summary = await brandRepository.getOverallSummary();
    const results: SummaryInfo[] = [
      {
        id: v4(),
        quantity: summary.brand.total,
        label: "BRAND COMPANIES",
        subs: [
          {
            id: v4(),
            quantity: summary.brand.totalLocation,
            label: "Locations",
          },
          {
            id: v4(),
            quantity: summary.brand.totalUser,
            label: "Teams",
          },
        ],
      },
      {
        id: v4(),
        quantity: sumBy(summary.countries.summary, "count"),
        label: "COUNTRIES",
        subs: ALL_REGIONS.map((region) => ({
          id: v4(),
          quantity:
            summary.countries.summary.find((el) => el.region === region)
              ?.count || 0,
          label: region,
        })),
      },
      {
        id: v4(),
        quantity: summary.product.total,
        label: "PRODUCTS",
        subs: [
          {
            id: v4(),
            quantity: summary.product.categories,
            label: "Categories",
          },
          {
            id: v4(),
            quantity: summary.product.collections,
            label: "Collections",
          },
          {
            id: v4(),
            quantity: summary.product.cards,
            label: "Cards",
          },
        ],
      },
    ];
    return successResponse({
      data: results,
    });
  }

  public async updateBrandStatus(
    brand_id: string,
    payload: { status: ActiveStatus }
  ) {
    const brand = await brandRepository.find(brand_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    if (brand.status === payload.status) {
      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
    }

    const updatedBrandStatus = await brandRepository.update(brand_id, {
      status: payload.status,
    });

    if (!updatedBrandStatus) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}

export const brandService = new BrandService();
export default BrandService;
