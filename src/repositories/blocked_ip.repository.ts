import BaseRepository from "./base.repository";
import BlockedIpModel, { IBlockedIpAttributes } from "@/model/blocked_ip.model";
import { v4 as uuidv4 } from "uuid";

class BlockedIpRepository extends BaseRepository<IBlockedIpAttributes> {
  protected model: BlockedIpModel;
  protected DEFAULT_ATTRIBUTE: Partial<IBlockedIpAttributes> = {
    id: "",
    user_ip: "",
    count: 0,
    blocked_type: 0,
  };

  constructor() {
    super();
    this.model = new BlockedIpModel();
  }

  public async upsert(user_ip: string, blocked_type: number, payload: any) {
    const now = new Date();
    return this.model.rawQueryV2(
      `UPSERT {user_ip: '${user_ip}', blocked_type: ${blocked_type}}
      INSERT @payloadWithId
      UPDATE {count: ${
        typeof payload.count === "number" ? payload.count : "OLD.count + 1"
      }, updated_at: @updatedAt}
      IN blocked_ips
      RETURN NEW
    `,
      {
        payloadWithId: {
          user_ip,
          blocked_type,
          ...payload,
          count: 1,
          id: uuidv4(),
          created_at: now,
          updated_at: now,
        },
        updatedAt: now,
      }
    );
  }
}

export default BlockedIpRepository;
export const blockedIpRepository = new BlockedIpRepository();
