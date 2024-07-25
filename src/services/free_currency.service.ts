import axios from "axios";
import * as Boom from "@hapi/boom";
import { MESSAGES } from "@/constants";
import { ENVIRONMENT } from "@/config";

class FreeCurrencyService {

  public exchange = async () => {
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
}
export default FreeCurrencyService;
export const freeCurrencyService = new FreeCurrencyService();
