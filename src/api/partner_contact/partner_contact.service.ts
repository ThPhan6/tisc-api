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
import { mailService } from "@/services/mail.service";
import {
  ILocationAttributes,
  IMessageResponse,
  SortOrder,
  UserAttributes,
  UserStatus,
  UserType,
} from "@/types";
import { isNil, pick } from "lodash";
import {
  PartnerContactAttributes,
  PartnerContactListResponse,
  PartnerContactRequest,
  PartnerContactSort,
} from "./partner_contact.type";

class PartnerContactService {
  private async createPartnerContact(
    authenticatedUser: UserAttributes,
    path: string,
    payload: PartnerContactRequest,
    location?: ILocationAttributes
  ) {
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

  public async get(userId: string, authenticatedUser: UserAttributes) {
    const user = await userRepository.findBy({
      id: userId,
      type: UserType.Partner,
    });

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    let companyName = DEFAULT_UNEMPLOYED_COMPANY_NAME;
    if (user.relation_id !== authenticatedUser.relation_id) {
      const partner = await partnerRepository.find(user.relation_id);

      if (!partner) {
        return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
      }

      companyName = partner.name;
    }

    const result = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullname: `${user.firstname} ${user.lastname}`,
      gender: user.gender,
      location_id: user.location_id,
      position: user.position,
      email: user.email,
      phone: user.phone,
      mobile: user.mobile,
      linkedin: user.linkedin,
      created_at: user.created_at,
      status: user.status,
      relation_id: user.relation_id,
      phone_code: user.phone_code || "00",
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

    let relationId = authenticatedUser.relation_id;
    let location = undefined;
    if (!isNil(payload.relation_id) && payload.relation_id !== relationId) {
      const partner = await partnerRepository.find(payload.relation_id);

      if (!partner) {
        return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
      }

      if (partner.brand_id !== authenticatedUser.relation_id) {
        return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
      }

      relationId = partner.id;
      location = await locationRepository.find(partner.location_id);
    }

    return this.createPartnerContact(
      authenticatedUser,
      path,
      {
        ...payload,
        relation_id: relationId,
      },
      location
    );
  }

  public async update(
    authenticatedUser: UserAttributes,
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

    let relationId = authenticatedUser.relation_id;
    let location = undefined;
    if (!isNil(payload.relation_id) && payload.relation_id !== relationId) {
      const partner = await partnerRepository.find(payload.relation_id);

      if (!partner) {
        return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
      }

      if (partner.brand_id !== authenticatedUser.relation_id) {
        return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
      }

      relationId = partner.id;
      location = await locationRepository.find(partner.location_id);
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
        relation_id: relationId,
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

    const partner = await partnerRepository.find(user.relation_id);
    if (!partner) {
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
    }

    if (user.status === UserStatus.Active) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED_ALREADY);
    }

    if (user.status === UserStatus.Uninitiate) {
      const updatedUser = await userRepository.update(user.id, {
        status: UserStatus.Pending,
      });

      if (!updatedUser) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
      }
    }

    await mailService.sendInviteEmailTeamProfile(user, authenticatedUser);
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new PartnerContactService();
