import EmailLogModel, { EmailLogAttributes } from "@/model/email_logs.model";
import BaseRepository from "./base.repository";

class EmailLogRepository extends BaseRepository<EmailLogAttributes> {
  protected model: EmailLogModel;
  protected DEFAULT_ATTRIBUTE: Partial<EmailLogAttributes> = {
    id: "",
    type: "",
    email: "",
    message: "",
  };

  constructor() {
    super();
    this.model = new EmailLogModel();
  }
}

export default EmailLogRepository;
export const emailLogRepository = new EmailLogRepository();
