import {
  DEFAULT_UNEMPLOYED_COMPANY_NAME,
  MESSAGES,
  PartnerRoles,
  RoleNames,
} from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { locationRepository } from "@/repositories/location.repository";
import partnerRepository from "@/repositories/partner.repository";
import { partnerContactRepository } from "@/repositories/partner_contact.repository";
import { userRepository } from "@/repositories/user.repository";
import { ActivityTypes, logService } from "@/services/log.service";
import {
  IMessageResponse,
  SortOrder,
  UserAttributes,
  UserStatus,
  UserType,
} from "@/types";
import { userService } from "../user/user.service";
import {
  PartnerContactAttributes,
  PartnerContactListResponse,
  PartnerContactRequest,
  PartnerContactResponse,
  PartnerContactSort,
} from "./partner_contact.type";
import { pick } from "lodash";
import { mailService } from "@/services/mail.service";

class PartnerContactService {
  public async getList(
    authenticatedUser: UserAttributes,
    limit: number,
    offset: number,
    filter: { status: UserStatus },
    sort: PartnerContactSort,
    order: SortOrder
  ): Promise<PartnerContactListResponse> {
    const { partner_contacts, pagination } =
      await partnerContactRepository.getListPartnerContact(
        limit,
        offset,
        sort,
        order,
        authenticatedUser.relation_id,
        filter
      );

    return {
      data: {
        partner_contacts: partner_contacts.map((partner: any) =>
          pick({ ...partner, phone_code: partner?.phone_code || "00" }, [
            "id",
            "fullname",
            "firstname",
            "lastname",
            "email",
            "phone",
            "mobile",
            "gender",
            "remark",
            "position",
            "status",
            "created_at",
            "updated_at",
            "relation_id",
            "company_name",
            "country_name",
            "phone_code",
          ])
        ),
        pagination,
      },
      statusCode: 200,
    };
  }

  public async get(
    userId: string,
    authenticatedUser: PartnerContactAttributes
  ) {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    /// user login
    const brandOfAuthenticatedUser = await brandRepository.find(
      authenticatedUser.relation_id
    );

    if (!brandOfAuthenticatedUser) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND);
    }

    /// partner
    let partner: any = await partnerRepository.find(user.relation_id);

    if (!partner) {
      const brand = await brandRepository.find(user.relation_id);

      if (brand) {
        partner = { ...brand, brand_id: brand.id };
      }
    }

    if (!partner) {
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
    }

    const brandOfUser = await brandRepository.find(partner.brand_id);

    if (!brandOfUser) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND);
    }

    // check user in the same workspace
    if (brandOfAuthenticatedUser.id !== brandOfUser.id) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    let companyName = DEFAULT_UNEMPLOYED_COMPANY_NAME;
    if (user.type === UserType.Partner) {
      const partner = await partnerRepository.find(user.relation_id);

      if (partner) {
        companyName = partner.name;
      }
    }

    const result = {
      id: user.id,
      role_id: user.role_id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullname: `${user.firstname} ${user.lastname}`,
      gender: user.gender,
      location_id: user.location_id,
      work_location: user.work_location,
      department_id: user.department_id,
      position: user.position,
      email: user.email,
      phone: user.phone,
      mobile: user.mobile,
      avatar: user.avatar,
      backup_email: user.backup_email,
      personal_mobile: user.personal_mobile,
      linkedin: user.linkedin,
      created_at: user.created_at,
      access_level: RoleNames[user.role_id],
      status: user.status,
      type: user.type,
      relation_id: user.relation_id,
      phone_code: user.phone_code || "00",
      retrieve_favourite: user.retrieve_favourite,
      interested: user.interested,
      personal_phone_code: user.personal_phone_code || "",
      remark: user.remark || "",
      company_name: companyName,
    };

    return successResponse({
      data: pick(result, [
        "id",
        "firstname",
        "lastname",
        "email",
        "phone",
        "mobile",
        "gender",
        "remark",
        "position",
        "status",
        "created_at",
        "updated_at",
        "relation_id",
        "company_name",
        "phone_code",
      ]),
    });
  }

  public async create(
    authenticatedUser: UserAttributes,
    payload: PartnerContactRequest,
    path: string
  ) {
    const user = await userRepository.findBy({ email: payload.email });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_USED);
    }

    let partner: any = await partnerRepository.find(payload.relation_id);

    if (!partner) {
      const brand = await brandRepository.find(payload.relation_id);

      if (brand) {
        partner = { ...brand, brand_id: brand.id };
      }
    }

    if (!partner) {
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
    }

    const location =
      payload.relation_id == partner.brand_id
        ? null
        : await locationRepository.find(partner.location_id);

    if (location && partner.brand_id !== authenticatedUser.relation_id) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    const locationId = location?.id ?? null;
    const workLocation = !locationId
      ? ""
      : location?.city_name
      ? `${location.city_name}, ${location?.country_name?.toUpperCase()}`
      : `${location?.country_name?.toUpperCase()}`;

    const createdUser: PartnerContactAttributes | undefined =
      await userRepository.create({
        firstname: payload.firstname,
        lastname: payload.lastname,
        gender: payload.gender,
        location_id: locationId,
        work_location: workLocation,
        remark: payload.remark ?? "",
        position: payload.position,
        email: payload.email,
        phone: payload.phone,
        password: "",
        phone_code: location?.phone_code ?? "",
        mobile: payload.mobile,
        role_id: PartnerRoles.Admin,
        is_verified: false,
        verification_token: await userRepository.generateToken(
          "verification_token"
        ),
        type: UserType.Partner,
        relation_id: payload.relation_id,
        department_id: null,
        avatar: null,
        status: payload.status ?? UserStatus.Uninitiate,
      });

    if (!createdUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    logService.create(ActivityTypes.create_partner_profile, {
      path,
      user_id: authenticatedUser.id,
      relation_id: authenticatedUser.relation_id,
      data: {
        user_id: createdUser.id,
      },
    });

    return this.get(createdUser.id, authenticatedUser);
  }

  public async update(
    authenticatedUser: PartnerContactAttributes,
    payload: PartnerContactRequest,
    path: string
  ) {
    const user = await userRepository.find(payload.id);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.email !== payload.email) {
      const userExist = await userRepository.findBy({ email: payload.email });
      if (userExist) {
        return errorMessageResponse(MESSAGES.EMAIL_USED);
      }
    }

    let partner: any = await partnerRepository.find(payload.relation_id);

    if (!partner) {
      const brand = await brandRepository.find(payload.relation_id);

      if (brand) {
        partner = { ...brand, brand_id: brand.id };
      }
    }

    if (!partner) {
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
    }

    const location =
      payload.relation_id == partner.brand_id
        ? null
        : await locationRepository.find(partner.location_id);

    if (location && partner.brand_id !== authenticatedUser.relation_id) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    const locationId = location?.id ?? null;
    const workLocation = !locationId
      ? ""
      : location?.city_name
      ? `${location.city_name}, ${location?.country_name?.toUpperCase()}`
      : `${location?.country_name?.toUpperCase()}`;

    const updatedUser: PartnerContactAttributes | undefined =
      (await userRepository.update(payload.id, {
        firstname: payload.firstname,
        lastname: payload.lastname,
        gender: payload.gender,
        location_id: locationId,
        work_location: workLocation,
        remark: payload.remark ?? "",
        position: payload.position,
        email: payload.email,
        phone: payload?.phone,
        phone_code: location?.phone_code ?? "",
        mobile: payload.mobile,
        relation_id: payload.relation_id,
        status: payload.status,
      })) as PartnerContactAttributes;

    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    logService.create(ActivityTypes.update_partner_profile, {
      path,
      user_id: authenticatedUser.id,
      relation_id: authenticatedUser.relation_id,
      data: {
        user_id: updatedUser.id,
      },
    });

    return this.get(updatedUser.id, authenticatedUser);
  }

  public async delete(
    userId: string,
    authenticatedUser: UserAttributes,
    path: string
  ) {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const deletedUser = await userRepository.delete(user.id);

    if (!deletedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    logService.create(ActivityTypes.delete_partner_profile, {
      path,
      user_id: authenticatedUser.id,
      relation_id: authenticatedUser.relation_id,
      data: {
        user_id: userId,
      },
    });

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async invite(
    userId: string,
    authenticatedUser: UserAttributes
  ): Promise<IMessageResponse> {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.status === UserStatus.Active) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED_ALREADY);
    }

    const updatedUser = await userRepository.update(user.id, {
      status: UserStatus.Pending,
    });

    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    await mailService.sendInviteEmailTeamProfile(user, authenticatedUser);
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new PartnerContactService();
