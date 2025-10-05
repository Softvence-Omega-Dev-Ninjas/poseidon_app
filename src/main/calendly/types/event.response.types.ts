import { Location } from './calendly.types';

type CustomQuestion = {
  answer_choices: string[];
  enabled: boolean;
  include_other: boolean;
  name: string;
  position: number;
  required: boolean;
  type: string;
};

type Profile = {
  name: string;
  owner: string;
  type: string;
};

export type Event = {
  active: boolean;
  admin_managed: boolean;
  booking_method: string;
  color: string;
  created_at: string;
  custom_questions: CustomQuestion[];
  deleted_at: string | null;
  description_html: string;
  description_plain: string;
  duration: number;
  duration_options: any | null; // Could be more specific if we had more data on this
  internal_note: string | null;
  kind: string;
  locale: string;
  locations: Location[];
  name: string;
  pooling_type: any | null; // Could be more specific if we had more data on this
  position: number;
  profile: Profile;
  scheduling_url: string;
  secret: boolean;
  slug: string;
  type: string;
  updated_at: string;
  uri: string;
};

export type EventResponse = {
  message: string;
  event: Event;
};
