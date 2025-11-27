export type CalendlyAvailabilitySchedule = {
  uuid: string;
  event_type: string;
  timezone: string;
  rules: WeeklyScheduleRule[];
  created_at?: string;
  updated_at?: string;
};

export type WeeklyScheduleRule = {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  intervals: Array<{
    start_time: string; // HH:MM
    end_time: string; // HH:MM
  }>;
};
