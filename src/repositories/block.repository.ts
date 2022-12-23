import BaseRepository from "./base.repository";
import BlockModel, { IBlockAttributes } from "@/model/block.model";

class BlockRepository extends BaseRepository<IBlockAttributes> {
  protected model: BlockModel;
  protected DEFAULT_ATTRIBUTE: Partial<IBlockAttributes> = {
    id: "",
    ip: "",
    count: 0,
    form_type: 0,
  };

  constructor() {
    super();
    this.model = new BlockModel();
  }
}

export default BlockRepository;
export const blockRepository = new BlockRepository();
