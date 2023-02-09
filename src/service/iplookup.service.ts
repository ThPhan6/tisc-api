import axios from 'axios';
import * as Boom from "@hapi/boom";
import {MESSAGES} from '@/constants';
import {ENVIRONMENT} from '@/config';

interface IpInfoResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  bogon?: boolean;
}

class IpLookupService {
  private endpointAPI = 'https://ipinfo.io';

  public search = async (ipAddress: string) => {
    const requestURI = `${this.endpointAPI}/${ipAddress}?token=${ENVIRONMENT.IPINFO_ACCESS_TOKEN}`;
    return axios.get<IpInfoResponse>(requestURI)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw Boom.badRequest(MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN)
      });
  }
}
export default IpLookupService;
export const ipLookupService = new IpLookupService();
