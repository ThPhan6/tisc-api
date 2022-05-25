import { IMessageResponse } from "../../type/common.type";
import UserModel from "../../model/user.model";
import MailService from "../../service/mail.service";
import { IUserRequest } from "./user.type";
import { createResetPasswordToken } from "../../helper/password.helper";
import { USER_STATUSES } from "../../constant/user.constant";

export default class UserService {
  private userModel: UserModel;
  private mailService: MailService;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
  }

  public create = (payload: IUserRequest): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (user) {
        return resolve({
          message: "Email is already used.",
          statusCode: 400,
        });
      }
      let verificationToken: string;
      let isDuplicated = true;
      do {
        verificationToken = createResetPasswordToken();
        const duplicateVerificationTokenFromDb = await this.userModel.findBy({
          verification_token: verificationToken,
        });
        if (!duplicateVerificationTokenFromDb) isDuplicated = false;
      } while (isDuplicated);

      const createdUser = await this.userModel.create({
        firstname: payload.firstname,
        lastname: payload.lastname,
        gender: payload.gender,
        location_id: payload.location_id,
        department: payload.department,
        position: payload.position,
        email: payload.email,
        phone: payload.phone,
        mobile: payload.mobile,
        role_id: payload.role_id,
        is_verified: false,
        verification_token: verificationToken,
        status: USER_STATUSES.PENDING,
        type: payload.type,
      });
      if (!createdUser) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      await this.mailService.sendInviteEmail(createdUser);

      return resolve({
        message: "Success",
        statusCode: 200,
      });
    });
  };
}
