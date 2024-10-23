import { ENVIRONMENT } from "@/config";
import { MESSAGES } from "@/constants";
import * as Boom from "@hapi/boom";
import axios from "axios";

class FreeCurrencyService {
  public exchange = async (): Promise<{ data: Record<string, number> }> => {
    return axios
      .get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${ENVIRONMENT.FREE_CURRENCY_API_KEY}`
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw Boom.badRequest(
          MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
        );
      });
  };

  public currencies = async (): Promise<{ data: Record<string, any> }> => {
    return axios
      .get(
        `https://api.freecurrencyapi.com/v1/currencies?apikey=${ENVIRONMENT.FREE_CURRENCY_API_KEY}`
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw Boom.badRequest(
          MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
        );
      });
  };

  public exchangeRate = async () => {
    const exchange = await this.exchange();
    const currencies = await this.currencies();

    if (!exchange.data || !currencies.data) {
      throw Boom.badRequest(MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN);
    }

    return Object.keys(exchange.data).map((key) => ({
      ...currencies.data[key],
      rate: exchange.data[key],
    }));
  };
}
export default FreeCurrencyService;
export const freeCurrencyService = new FreeCurrencyService();
