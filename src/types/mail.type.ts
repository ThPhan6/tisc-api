export interface BookingEmailPayload {
  to: string,
  subject: string,
  timezone: string;
  first_name: string,
  start_time: string,
  conference_url: string,
  reschedule_url: string,
  cancel_url: string,
}
