import axios from "axios";
import * as Boom from "@hapi/boom";
import { MESSAGES } from "@/constants";
import { ENVIRONMENT } from "@/config";
import { v4 as uuidv4 } from "uuid";

interface InvoiceInfo {
  amount: number;
  currency: string;
  metadata: any;
}

export interface PaymentAttempAttribute {
  status: string;
  payment_intent_id: string;
}
export interface PaymentAttemptResponse {
  has_more: boolean;
  items: PaymentAttempAttribute[];
}
class AirwallexService {
  public createPaymentIntent = (data: InvoiceInfo) => {
    return new Promise(async (resolve) => {
      const authenticated = await this.login();
      if (!authenticated) return resolve(false);
      return axios
        .create({
          baseURL: ENVIRONMENT.AIRWALLEX_API_ENPOINT,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authenticated.token}`,
          },
        })
        .post("/api/v1/pa/payment_intents/create", {
          request_id: uuidv4(),
          merchant_order_id: uuidv4(),
          ...data,
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          throw Boom.badRequest(
            MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
          );
        });
    });
  };
  public listPaymentAttempts = (
    paymentIntentId: string
  ): Promise<PaymentAttemptResponse | false> => {
    return new Promise(async (resolve) => {
      const authenticated = await this.login();
      if (!authenticated) return resolve(false);
      return axios
        .create({
          baseURL: ENVIRONMENT.AIRWALLEX_API_ENPOINT,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authenticated.token}`,
          },
        })
        .get(`/api/v1/pa/payment_attempts?payment_intent_id=${paymentIntentId}`)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          throw Boom.badRequest(
            MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
          );
        });
    });
  };
  public login = async () => {
    return axios
      .create({
        baseURL: ENVIRONMENT.AIRWALLEX_API_ENPOINT,
        headers: {
          "Content-Type": "application/json",
          "x-client-id": ENVIRONMENT.AIRWALLEX_CLIENT_KEY,
          "x-api-key": ENVIRONMENT.AIRWALLEX_API_KEY,
        },
      })
      .post("/api/v1/authentication/login")
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw Boom.badRequest(
          MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
        );
      });
  };
}
export default AirwallexService;
export const airwallexService = new AirwallexService();
