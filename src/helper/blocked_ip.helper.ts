import { ROUTES } from "@/constants";
import { blockedIpRepository } from "@/repositories/blocked_ip.repository";
import { BlockedType } from "@/types/block.type";
import { Request } from "@hapi/hapi";

export const getBlockedType = (route: string) => {
  let value = 0;
  switch (route) {
    case ROUTES.AUTH.BRAND_DESIGN_LOGIN:
      value = BlockedType.Brand_design_login;
      break;
    case ROUTES.AUTH.FORGOT_PASSWORD:
      value = BlockedType.Forgot_password;
      break;
    case ROUTES.AUTH.RESET_PASSWORD:
      value = BlockedType.Reset_password;
      break;
    case ROUTES.AUTH.RESET_PASSWORD_AND_LOGIN:
      value = BlockedType.Reset_password_and_login;
      break;
    case ROUTES.AUTH.DESIGN_REGISTER:
      value = BlockedType.Designer_signup;
      break;
    case ROUTES.AUTH.CREATE_PASSWORD_VERIFY:
      value = BlockedType.Create_password;
      break;
    case ROUTES.BOOKING.CREATE:
      value = BlockedType.Booking;
      break;
    case ROUTES.CREATE_CONTACT:
      value = BlockedType.Contact;
      break;

    default:
      value = BlockedType.Login;
      break;
  }
  return value;
};

export const upsertBlockedIp = async (request: Request, code: number) => {
  const blocked_type = getBlockedType(request.route.path);
  const user_ip =
    request.headers["x-forwarded-for"] || request.info.remoteAddress;

  let payload = {};
  const codes = [200, 400, 404];
  if (codes.includes(code)) {
    if (code === 200) {
      payload = {
        ...payload,
        count: 0,
      };
    }
    await blockedIpRepository.upsert(user_ip, blocked_type, payload);
  }
};

export const getBlockPeriod = (count: number) => {
  return count >= 5 && count < 10 ? 0.5 : 5;
};
