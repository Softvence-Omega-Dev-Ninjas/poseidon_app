export interface Payload {
  cancel_url: string;
  created_at: string;
  email: string;
  event: string;
  first_name: string | null;
  invitee_scheduled_by: string | null;
  last_name: string | null;
  name: string;
  new_invitee: string | null;
  no_show: string | null;
  old_invitee: string | null;
  payment: string | null;
  questions_and_answers: {
    answer: string;
    position: number;
    question: string;
  }[];
  reconfirmation: string | null;
  reschedule_url: string;
  rescheduled: boolean;
  routing_form_submission: string | null;
  scheduled_event: {
    created_at: string;
    end_time: string;
    event_guests: any[]; // you can replace 'any' with a proper type if known
    event_memberships: any[]; // same here
    event_type: string;
    invitees_counter: {
      total: number;
      active: number;
      limit: number;
    };
    location: {
      data: Record<string, any>; // flexible for nested Zoom/meeting data
      join_url: string;
      status: string;
      type: string;
    };
    meeting_notes_html: string | null;
    meeting_notes_plain: string | null;
    name: string;
    start_time: string;
    status: string;
    updated_at: string;
    uri: string;
  };
  scheduling_method: string | null;
  status: string;
  text_reminder_number: string | null;
  timezone: string;
  tracking: {
    utm_campaign: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_content: string | null;
    utm_term: string | null;
    salesforce_uuid: string | null;
  };
  updated_at: string;
  uri: string;
}

export interface CalendlyWebhookPayload {
  event: string; // e.g., "invitee.created", "invitee.canceled"
  time: string; // ISO timestamp of webhook creation
  payload: Payload;
}

// {
//   event: string; // e.g., "invitee.created", "invitee.canceled"
//   time: string; // ISO timestamp of webhook creation
//   payload: {
//     uri: string; // Invitee URI
//     name: string;
//     email?: string | null;
//     status: 'active' | 'canceled';
//     timezone: string; // e.g., "Asia/Dhaka"
//     created_at: string; // ISO timestamp
//     updated_at: string; // ISO timestamp
//     canceled_at?: string | null;
//     canceled_by?: string | null;
//     rescheduled?: boolean;
//     text_reminder_number?: string | null;

//     event: string; // Scheduled event URL
//     event_type: string; // Event type URL
//     scheduling_method?: string | null;

//     /**
//      * Answers to custom questions.
//      * Appears when you add custom invitee questions in Calendly.
//      */
//     questions_and_answers?: {
//       question: string;
//       answer: string;
//       position?: number;
//     }[];

//     /**
//      * The meeting location (Zoom, Google Meet, Custom link, etc.)
//      */
//     location?: {
//       type: string; // e.g., "zoom", "google_conference", "physical", "custom"
//       location?: string; // e.g., "Zoom", "Google Meet"
//       join_url?: string;
//       additional_info?: string | null;
//     };

//     /**
//      * UTM and Salesforce tracking info (custom data you pass in the scheduling URL)
//      */
//     tracking?: {
//       utm_campaign?: string | null | undefined;
//       utm_source?: string | null | undefined; // membership / service / supporter card
//       utm_medium?: string | null | undefined; // service table Id - uuid
//       utm_content?: string | null | undefined; // duration
//       utm_term?: string | null | undefined; //userid
//       salesforce_uuid?: string | null | undefined; //bergirlid
//     };

//     /**
//      * Details about the scheduled event
//      */
//     scheduled_event?: {
//       uri: string;
//       name: string;
//       start_time: string; // ISO time
//       end_time?: string;
//       status: 'active' | 'canceled';
//       event_type: string;
//       created_at?: string;
//       updated_at?: string;
//       location?: {
//         type: string;
//         join_url?: string;
//         location?: string;
//       };
//     };

//     /**
//      * For group meetings, this may include multiple members
//      */
//     event_memberships?: {
//       user: string; // e.g., "https://api.calendly.com/users/uuid"
//       user_email: string;
//     }[];

//     /**
//      * Webhook signature (sent in header x-calendly-signature)
//      */
//     signature?: string;
//   };
// }
