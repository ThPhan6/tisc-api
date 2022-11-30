export interface EventTime {
  timestamp: string;
  timezone: string;
}
export interface CalendarEventResponse {
  attendee_ability: string;
  create_time: string;
  description: string;
  end_time: EventTime;
  event_id: string;
  organizer_calendar_id: string;
  start_time: EventTime;
  status: string;
  summary: string;
  visibility: string;
  vchat: {
    meeting_url: string;
    vc_type: string;
  }
}

export interface EventPayloadRequest {
  summary: string;
  description: string;
  start_time: EventTime;
  end_time: EventTime;
  vchat: {
    vc_type: string;
  };
  visibility: 'default' | 'public' | 'private';
  reminders: {
    minutes: number;
  }[];
  need_notification: boolean;
  attendee_ability: 'can_see_others' | 'none' | 'can_invite_others' | 'can_modify_event';
}

export interface CreateEventResponse {
  code: number;
  msg: string;
  data: {
    event: {
      event_id: string;
      organizer_calendar_id: string;
      summary: string;
      description: string;
      need_notification: boolean;
      start_time: EventTime;
      end_time: EventTime;
      vchat: {
        vc_type: string;
        meeting_url: string;
        icon_type?: string;
        description?: string;
      }
    }
  }
}

export interface LarkToken {
  access_token: string;
  access_token_expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  app_access_token: string;
  app_access_token_expires_in: number;
}


export interface AppAcessTokenPayload {
  app_id: string;
  app_secret: string;
}

export interface AppAcessTokenResponse {
  app_access_token: string;
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

export interface ParticipantPayload {
  type: 'user' | 'chat' | 'resource' | 'third_party',
  user_id?: string;
  third_party_email?: string;
}
