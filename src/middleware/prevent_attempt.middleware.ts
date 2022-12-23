import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { getBlockPeriod, getFormType } from "@/helper/block.helper";
import moment from "moment";
import { blockRepository } from "@/repositories/block.repository";
import { convertMsToTime } from "@/helper/common.helper";

export const preventAttempt = async (
  request: Request,
  response: ResponseToolkit
) => {
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  const formType = getFormType(request.route.path);
  const block = await blockRepository.findBy({
    ip,
    form_type: formType,
  });
  const blockCounts = [5, 10];
  if (block && block.blocked_at && blockCounts.includes(block.count)) {
    const blockTime = moment(block.blocked_at);
    const now = moment();
    const blockPeriod = getBlockPeriod(block.count);
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
