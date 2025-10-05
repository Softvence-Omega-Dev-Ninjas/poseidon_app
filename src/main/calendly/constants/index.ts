import { CalendlyPayload } from '../types/calendly.types';

export const defaultCalendlyPayload: Partial<CalendlyPayload> = {
  kind: 'solo',
  locations: [
    {
      kind: 'zoom_conference', // Default location type
    },
  ],
  scheduling_url: null,
  locale: 'en',
  visibility: 'public',
  active: true,
  description: 'This is the description',
  // duration_options: [15, 30], // Uncomment if you plan to use this
};
