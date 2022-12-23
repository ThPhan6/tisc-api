import { ROUTES } from "@/constants";
import { IBlockAttributes } from "@/model/block.model";
import { blockRepository } from "@/repositories/block.repository";
import { BlockFormType } from "@/types/block.type";
import moment from "moment";
import { Request } from "@hapi/hapi";

export const getFormType = (route: string) => {
  let value = 0;
  switch (route) {
    case ROUTES.AUTH.TISC_LOGIN:
      value = BlockFormType.Login;
      break;
    case ROUTES.AUTH.BRAND_DESIGN_LOGIN:
      value = BlockFormType.Brand_design_login;
      break;
    case ROUTES.AUTH.FORGOT_PASSWORD:
      value = BlockFormType.Forgot_password;
      break;
    case ROUTES.AUTH.RESET_PASSWORD:
      value = BlockFormType.Reset_password;
      break;
    case ROUTES.AUTH.RESET_PASSWORD_AND_LOGIN:
      value = BlockFormType.Reset_password_and_login;
      break;
    case ROUTES.AUTH.DESIGN_REGISTER:
      value = BlockFormType.Designer_signup;
      break;
    case ROUTES.AUTH.CREATE_PASSWORD_VERIFY:
      value = BlockFormType.Create_password;
      break;
    case ROUTES.BOOKING.CREATE:
      value = BlockFormType.Booking;
      break;
    case ROUTES.CREATE_CONTACT:
      value = BlockFormType.Contact;
      break;

    default:
      break;
  }
  return value;
};
const execFail = async (
  block: IBlockAttributes | undefined,
  ip: string,
  form_type: number
) => {
  if (!block) {
    await blockRepository.create({
      ip,
      form_type,
    });
  } else {
    if (block.count === 4 || block.count === 9) {
      await blockRepository.update(block.id, {
        blocked_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
    }
    await blockRepository.update(block.id, {
      count: block.count < 10 ? block.count + 1 : 1,
    });
  }
};
export const createOrUpdateBlock = async (request: Request, code: number) => {
  const form_type = getFormType(request.route.path);
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  const block = await blockRepository.findBy({
    ip,
    form_type,
  });
  if (code === 200 && block) {
    await blockRepository.update(block.id, {
      count: 0,
      blocked_at: null,
    });
  }
  if (code === 400 || code === 404) {
    await execFail(block, ip, form_type);
  }
};

export const getBlockPeriod = (count: number) => {
  return count === 5 ? 0.5 : 5;
};
