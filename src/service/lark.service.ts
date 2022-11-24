import {ENVIROMENT} from '@/config';
import {MESSAGES} from '@/constants';
import axios from 'axios';
import moment from 'moment';
import {
  EventPayloadRequest,
  EventReschedulePayloadRequest,
  LarkToken,
  AppAcessTokenPayload,
  AppAcessTokenResponse,
  UserRefreshAccessTokenResponse,
} from '@/types/lark.type';
import fs from 'fs';

class LarkOpenAPIService {
  //
  private baseUrl: string;
  private appAccessTokenPayload: AppAcessTokenPayload;
  private lark_token: LarkToken;
  private dataPath = `${process.cwd()}/data/lark.json`;
  private intervalRefreshToken: any;
  //
  constructor() {
    this.baseUrl = ENVIROMENT.LARK_OPEN_API_URL;
    this.appAccessTokenPayload = {
      app_id: ENVIROMENT.LARK_APP_ID,
      app_secret: ENVIROMENT.LARK_APP_SECRET
    };
    this.lark_token = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
    this.updateRefreshToken();
  }

  private getAppAccessToken = async () => {
    const timestamp = moment().unix();
    const next20Mins = timestamp + 1200;
    if (this.lark_token.app_access_token_expires_in >= next20Mins) {
        return true;
    }
    const appAccessToken = await axios.post<AppAcessTokenResponse>(
      `${this.baseUrl}/auth/v3/app_access_token/internal`,
      this.appAccessTokenPayload
    );
    ///
    if (appAccessToken.data.code !== 0) {
      console.info(appAccessToken.data);
      throw Error(MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN);
    }
    //
    this.lark_token = {
      ...this.lark_token,
      app_access_token: appAccessToken.data.app_access_token,
      app_access_token_expires_in: timestamp + appAccessToken.data.expire,
    };
    //
    const refreshAccessToken = await axios.post<UserRefreshAccessTokenResponse>(
      `${this.baseUrl}/authen/v1/refresh_access_token`,
      {
        refresh_token: this.lark_token.refresh_token,
        grant_type: "refresh_token"
      },
      {headers: { Authorization: `Bearer ${appAccessToken.data.app_access_token}` }}
    );
    //
    if (refreshAccessToken.data.code !== 0) {
      console.info(refreshAccessToken.data);
      throw Error(MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN);
    }
    const { data } = refreshAccessToken.data;
    this.lark_token = {
      ...this.lark_token,
      access_token: data.access_token,
      access_token_expires_in: timestamp + data.expires_in,
      refresh_token: data.refresh_token,
      refresh_expires_in: timestamp + data.refresh_expires_in,
    };
    fs.writeFileSync(this.dataPath, JSON.stringify(this.lark_token));
  }

  public getEventList = async (start_time: string, end_time: string) => {
    await this.getAppAccessToken();
    //
    return axios.get(
      `${this.baseUrl}/calendar/v4/calendars/${ENVIROMENT.LARK_CALENDAR_ID}/events`,
      {
        params: {start_time, end_time},
        headers: { Authorization: `Bearer ${this.lark_token.access_token}` }
      }
    )
  }

  public createEvent = async (data: Partial<EventPayloadRequest>) => {
    await this.getAppAccessToken();
    //
    return axios.post(`${this.baseUrl}/calendar/v4/calendars/${ENVIROMENT.LARK_CALENDAR_ID}/events`,
      {
        ...data,
        visibility: 'public',
        reminders: [{minutes: 30}],
        need_notification: true,
        attendee_ability: 'can_invite_others',
        vchat: {
          vc_type: 'vc'
        }
      },
      { headers: { Authorization: `Bearer ${this.lark_token.access_token}` }}
    )
  }

  public updateEvent = async (event_id: string, data: EventReschedulePayloadRequest) => {
    await this.getAppAccessToken();
    //
    return axios.patch(
      `${this.baseUrl}/calendar/v4/calendars/${ENVIROMENT.LARK_CALENDAR_ID}/events/${event_id}`,
      data,
      { headers: { Authorization: `Bearer ${this.lark_token.access_token}` }}
    )
  }

  public deleteEvent = async (event_id: string) => {
    await this.getAppAccessToken();
    //
    return axios.delete(`${this.baseUrl}/calendar/v4/calendars/${ENVIROMENT.LARK_CALENDAR_ID}/events/${event_id}`,
      { headers: { Authorization: `Bearer ${this.lark_token.access_token}` }}
    )
  }

  private updateRefreshToken = async () => {
    if (this.intervalRefreshToken) {
      clearInterval(this.intervalRefreshToken);
    }
    // update every 5 days
    this.intervalRefreshToken = setInterval(() => this.getAppAccessToken(), (5 * 86400 * 1000));
  }
}

export default LarkOpenAPIService;
export const larkOpenAPIService = new LarkOpenAPIService();
