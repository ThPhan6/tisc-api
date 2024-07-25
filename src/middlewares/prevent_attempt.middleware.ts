import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { getBlockPeriod, getBlockedType } from "@/helpers/blocked_ip.helper";
import moment from "moment";
import { blockedIpRepository } from "@/repositories/blocked_ip.repository";
import { convertMsToTime } from "@/helpers/common.helper";
import { ENVIRONMENT } from "@/config";

export const preventAttempt = async (
  request: Request,
  response: ResponseToolkit
) => {
  if (ENVIRONMENT.DISABLE_VERIFY_FOR_LOAD_TEST === "1") {
    return response;
  }
  const user_ip =
    request.headers["x-forwarded-for"] || request.info.remoteAddress;
  const blocked_type = getBlockedType(request.route.path);
  const blockedIp = await blockedIpRepository.findBy({
    user_ip,
    blocked_type,
  });
  if (blockedIp && blockedIp.count >= 5) {
    const blockTime = moment(blockedIp.updated_at);
    const now = moment();
    const blockPeriod = getBlockPeriod(blockedIp.count);
    const diff = now.diff(blockTime, "seconds");
    if (diff <= blockPeriod * 60) {
      throw Boom.badRequest(
        `You are blocked. Please try after ${convertMsToTime(
          (blockPeriod * 60 - diff) * 1000
        )}`
      );
    }
  }
  return response;
};
