import { locationService } from "./../location/location.service";
import {
  BRAND_STATUSES,
  MESSAGES,
  ROLES,
  SYSTEM_TYPE,
  USER_STATUSES,
} from "@/constants";
import { pagination } from "@/helper/common.helper";
import { createResetPasswordToken } from "@/helper/password.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import { userRepository } from "@/repositories/user.repository";
import CountryStateCityService from "@/service/country_state_city_v1.service";
import { uploadLogoBrand } from "@/service/image.service";
import MailService from "@/service/mail.service";
import { BrandAttributes, SortOrder } from "@/types";
import { productService } from "../product/product.services";
import {
  getCountryName,
  mappingBrands,
  mappingBrandsAlphabet,
  mappingBrandSummary,
} from "./brand.mapping";
import {
  IBrandRequest,
  IUpdateBrandProfileRequest,
  IUpdateBrandStatusRequest,
} from "./brand.type";

class BrandService {
  private mailService: MailService;
  private countryStateCityService: CountryStateCityService;
  constructor() {
    this.mailService = new MailService();
    this.countryStateCityService = new CountryStateCityService();
  }

  private async getOfficialWebsites(brand: BrandAttributes) {
    return Promise.all(
      brand.official_websites.map(async (officialWebsite) => {
        const country = await this.countryStateCityService.getCountryDetail(
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
    filter: any,
    sort: string,
    order: SortOrder
  ) {
    const dataBrandCustom = await brandRepository.getListBrandCustom(
      limit,
      offset,
      sort,
      order
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

  public async invite(current_user_id: string, id: string) {
    const brand = await brandRepository.find(id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    if (brand.status !== BRAND_STATUSES.PENDING) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED);
    }

    const user = await userRepository.find(current_user_id);

    const inviteUser = await userRepository.getAdminOfCompany(brand.id);

    if (!user || !inviteUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    await this.mailService.sendInviteEmailTeamProfile(inviteUser, user);

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getListCard(filter: any, sort: any) {
    const brands = await brandRepository.getAllBrandsWithSort(sort);

    const result = await Promise.all(
      brands.map(async (brand) => {
        const originLocation = await locationRepository.getOriginLocation(
          brand.id
        );

        const headquarter = await commonTypeRepository.findBy({
          name: "headquarter",
        });

        const headquarterLocation =
          await locationRepository.getFirstHeadquarterLocation(
            brand.id,
            headquarter?.id || ""
          );

        const brandSummary: any = await productService.getBrandProductSummary(
          brand.id
        );

        const teamProfiles = await userRepository.getTeamProfile(
          brand.team_profile_ids,
          ["id", "firstname", "lastname", "avatar"]
        );

        return {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          country: getCountryName(originLocation, headquarterLocation),
          category_count: brandSummary.data.category_count,
          collection_count: brandSummary.data.collection_count,
          card_count: brandSummary.data.card_count,
          teams: teamProfiles,
        };
      })
    );
    return successResponse({
      data: result,
    });
  }

  public async updateBrandProfile(
    userId: string,
    payload: IUpdateBrandProfileRequest
  ) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.type !== SYSTEM_TYPE.BRAND || !user.relation_id) {
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

  public async updateLogo(user_id: string, logo: any) {
    const user = await userRepository.find(user_id);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.type !== SYSTEM_TYPE.BRAND || !user.relation_id) {
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
      SYSTEM_TYPE.BRAND
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
      role_id: ROLES.BRAND_ADMIN,
      verification_token: verificationToken,
      is_verified: false,
      status: USER_STATUSES.PENDING,
      type: SYSTEM_TYPE.BRAND,
      relation_id: createdBrand.id,
      location_id: defaultLocation?.id,
    });
    if (!createdUser) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    //create brand permissions
    // await permissionService.initPermission(createdUser);

    const officialWebsites = this.getOfficialWebsites(createdBrand);

    return successResponse({
      data: { ...createdBrand, official_websites: officialWebsites },
    });
  }

  public async getBrandsSummary() {
    const dataSummary = await brandRepository.getBrandSummary();

    const userCount = await brandRepository.summaryUserAndLocation(
      null,
      "user"
    );

    const result = await mappingBrandSummary(dataSummary, userCount);

    return successResponse({
      data: result,
    });
  }

  public async updateBrandStatus(
    brand_id: string,
    payload: IUpdateBrandStatusRequest
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
