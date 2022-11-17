import { IReScheduleBookingRequest } from './../api/booking/booking.type';
import {ENVIROMENT} from '@/config';
import axios from 'axios';
import { isEmpty } from 'lodash';
import moment from 'moment';

class LarkOpenAPIService {
  // global variable
  private api_url: string;
  private app_id: string;
  private app_secret: string;
  private calendar_id: string;
  private app_access_token: string = '';
  private tenant_access_token: string = '';
  private token_created_at: string = '';

  // constructor function
  constructor() {
    this.api_url = ENVIROMENT.LARK_OPEN_API_URL;
    this.app_id = ENVIROMENT.LARK_APP_ID;
    this.app_secret = ENVIROMENT.LARK_APP_SECRET;
    this.calendar_id = ENVIROMENT.LARK_CALENDAR_ID;
  }

  private getAppAccessToken = async () => {
    try {
      const response = await axios.post(`${this.api_url}/open-apis/auth/v3/app_access_token/internal`, {
        app_id: this.app_id,
        app_secret: this.app_secret
      })
      this.app_access_token = response.data.app_access_token;
      this.tenant_access_token = response.data.tenant_access_token;
      this.token_created_at = moment().format('X');
    } catch (err) {
       return Promise.reject(err)
    }
  }

  private isExpiredToken = () => {
    if (isEmpty(this.token_created_at)) {
      return true;
    }

    const dt = moment();
    const duration = dt.diff(moment(this.token_created_at, "X"), 'minutes') ?? -1
    return (duration >= 118 || duration <= 0);
  }

  public getEventList = async (
    start_time: string,
    end_time: string
    ) => {
    if (this.isExpiredToken()) {
      await this.getAppAccessToken();
    }

    return axios.get(`${this.api_url}/open-apis/calendar/v4/calendars/${this.calendar_id}/events`,
      {
        params: {start_time, end_time},
        headers: { Authorization: `Bearer ${this.tenant_access_token}` }
      }
    )
  }

  public createEvent = async (
    data: IEventRequest
    ) => {
    if (this.isExpiredToken()) {
      await this.getAppAccessToken();
    }

    return axios.post(`${this.api_url}/open-apis/calendar/v4/calendars/${this.calendar_id}/events`,
      data,
      { headers: { Authorization: `Bearer ${this.tenant_access_token}` }}
    )
  }

  public updateEvent = async (
    event_id: string,
    data: IEventRescheduleRequest
    ) => {
    if (this.isExpiredToken()) {
      await this.getAppAccessToken();
    }

    return axios.patch(`${this.api_url}/open-apis/calendar/v4/calendars/${this.calendar_id}/events/${event_id}`,
      data,
      { headers: { Authorization: `Bearer ${this.tenant_access_token}` }}
    )
  }

  public deleteEvent = async (
    event_id: string
    ) => {
    if (this.isExpiredToken()) {
      await this.getAppAccessToken();
    }

    return axios.delete(`${this.api_url}/open-apis/calendar/v4/calendars/${this.calendar_id}/events/${event_id}`,
      { headers: { Authorization: `Bearer ${this.tenant_access_token}` }}
    )
  }
}

interface IEventRequest {
  summary: string,
  description: string,
  start_time: {
    timestamp: string,
    timezone: string,
  },
  end_time: {
    timestamp: string,
    timezone: string,
  },
  vchat: {
    vc_type: string;
  }
}

interface IEventRescheduleRequest {
  start_time: {
    timestamp: string,
    timezone: string,
  },
  end_time: {
    timestamp: string,
    timezone: string,
  }
}

export default LarkOpenAPIService;
export const larkOpenAPIService = new LarkOpenAPIService();
