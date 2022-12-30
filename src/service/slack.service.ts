import {ENVIROMENT} from '@/config';
import axios from 'axios';

class SlackService {
  private webhookUrl = '';
  constructor() {
      this.webhookUrl = ENVIROMENT.SLACK_INCOMING_WEBHOOK;
  }

  public errorHook = (
    uri: string = '',
    method: string = '',
    errorTrace: string = '',
    payload = {},
    params = {},
    query = {},
  ) => {
    if (
      !ENVIROMENT.SLACK_INCOMING_WEBHOOK ||
      ENVIROMENT.NODE_ENV === 'dev'
    ) {
      return true;
    }

    return axios.post(this.webhookUrl, {
      username: 'webhookbot',
      "blocks": [
        {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": `*_Error on ${ENVIROMENT.NODE_ENV} Server_* :ladybug:`
           }
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": `*URI:*\n${uri}`
           }
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": `*METHOD:*\n${method.toUpperCase()}`
           }
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": "*Payload:*\n```" + JSON.stringify(payload) + "```"
           }
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": "*Params:*\n```" + JSON.stringify(params) + "```"
           }
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": "*Query:*\n```" + JSON.stringify(query) + "```"
           }
         },
         {
           "type": "divider"
         },
         {
           "type": "section",
           "text": {
             "type": "mrkdwn",
             "text": `*Error Trace:*\n> ${errorTrace}`
           }
         },
         {
           "type": "divider"
         }
       ]
    });
  }
}

export default SlackService;
export const slackService = new SlackService();
