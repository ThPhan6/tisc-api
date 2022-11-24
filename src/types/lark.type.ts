export interface CalendarEventResponse {
  attendee_ability: string,
  create_time: string,
  description: string,
  end_time: {
    timestamp: string,
    timezone: string,
  },
  event_id: string,
  organizer_calendar_id: string,
  start_time: {
    timestamp: string,
    timezone: string
  },
  status: string,
  summary: string,
  visibility: string,
  vchat: {
    meeting_url: string;
    vc_type: string;
  }
}

export interface EventPayloadRequest {
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
  },
  visibility: 'default' | 'public' | 'private',
  reminders: {
    minutes: number;
  }[];
  need_notification: boolean;
  attendee_ability: 'can_see_others' | 'none' | 'can_invite_others' | 'can_modify_event';
}

export interface EventReschedulePayloadRequest extends Pick<
  EventPayloadRequest, 'start_time' | 'end_time'
> {}

export interface LarkToken {
  access_token: string;
  access_token_expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  app_access_token: string;
  app_access_token_expires_in: number;
}


export interface AppAcessTokenPayload {
  app_id: string,
  app_secret: string
}

export interface AppAcessTokenResponse {
  app_access_token: string,
  code: number;
  expire: number;
}
export interface UserRefreshAccessTokenResponse {
  code: number;
  data: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
  }
}
