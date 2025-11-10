export type WebhookSubscriptionsResponse = {
  collection: WebhookSubscription[];
  pagination: Pagination;
};

export type WebhookSubscription = {
  uri: string;
  callback_url: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  retry_started_at: string; // ISO timestamp
  state: 'active' | 'disabled' | 'paused' | string; // known values + fallback
  events: string[];
  scope: 'user' | 'organization' | 'group' | string;
  organization?: string;
  user?: string;
  group?: string;
  creator?: string;
};

export type Pagination = {
  count: number;
  next_page?: string;
  previous_page?: string;
  next_page_token?: string;
  previous_page_token?: string;
};
