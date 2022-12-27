import axios from 'axios';
import * as Boom from "@hapi/boom";
import {MESSAGES} from '@/constants';

interface IpLookupResponse {
  ip: string;
  ip_number: string;
  ip_version: number;
  country_name: string;
  country_code2: string;
  isp: string;
  response_code: 200 | 400;
  response_message: string;
}

class IpLookupService {
  private endpointAPI = 'https://api.iplocation.net';

  public search = async (ipAddress: string) => {
    return axios.get<IpLookupResponse>(`${this.endpointAPI}/?ip=${ipAddress}`)
      .then((response) => response.data)
      .catch(() => {
        throw Boom.badRequest(MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN)
      });
  }
}
export default IpLookupService;
export const ipLookupService = new IpLookupService();
