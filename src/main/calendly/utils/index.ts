import Axios from 'axios';

const CALENDLY_PERSONAL_ACCESS_TOKEN =
  process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
const CALENDLY_BASE_URL = process.env.CALENDLY_BASE_URL;

if (!CALENDLY_PERSONAL_ACCESS_TOKEN || !CALENDLY_BASE_URL)
  throw new Error('Access token and base not found on env');

export const axios = Axios.create({
  baseURL: CALENDLY_BASE_URL,
  headers: {
    Authorization: `Bearer ${CALENDLY_PERSONAL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
