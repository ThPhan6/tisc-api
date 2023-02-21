import LogModel, { LogAttributes } from "@/models/logs.model";
import BaseRepository from "./base.repository";

class LogRepository extends BaseRepository<LogAttributes> {
  protected model: LogModel;
  protected DEFAULT_ATTRIBUTE: Partial<LogAttributes> = {
    id: "",
    extra: {},
    message: "",
  };

  constructor() {
    super();
    this.model = new LogModel();
  }
}

export default LogRepository;
export const logRepository = new LogRepository();
