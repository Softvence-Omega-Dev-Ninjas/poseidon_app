export type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export const locale = ['en', 'fr', 'es', 'de', 'nl', 'pt', 'it', 'uk'] as const;
export type Locale = (typeof locale)[number];

export type Location = {
  kind: 'zoom_conference'; // You can expand this if other kinds are expected
};

export type Question = {
  answer_choices: any[];
  enabled: boolean; // enable and disable the question
  include_other: boolean; //
  name: string; // lebel of the input field
  position: number; // posisiton of the question
  required: boolean; // filed required
  type: string; // type only (text)
};

export type CalendlyPayload = {
  custom_questions?: Question[];
  name?: string;
  username?: string;
  slug?: string;
  kind?: 'solo';
  duration: number;
  owner?: string;
  locations?: Location[];
  timezone?: string;
  description?: string;
  scheduling_url?: string | null; // Can be a string or null
  locale?: Locale;
  visibility?: 'public' | 'private'; // You can adjust this based on possible values
  active?: boolean;
};

// evnet
// calendly.types.ts
export type CalendlyEventCollection = {
  collection: CalendlyEvent[];
  pagination: {
    count: number;
    next_page: string | null;
    previous_page: string | null;
  };
};

export type CalendlyEvent = {
  uri: string;
  name: string;
  status: 'active' | 'canceled';
  slug: string;
  start_time: string; // ISO Date
  end_time: string; // ISO Date
  event_type: string; // URI reference
  location: CalendlyEventLocation;
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string; // ISO Date
  updated_at: string; // ISO Date
};

export type CalendlyEventLocation = {
  type:
    | 'physical'
    | 'zoom'
    | 'google_conference'
    | 'microsoft_teams'
    | 'webex'
    | 'custom';
  location?: string; // for physical or custom
  join_url?: string; // for zoom/virtual
  status?: string; // optional
};
