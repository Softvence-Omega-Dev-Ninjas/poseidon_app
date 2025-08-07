interface ResDataOptions {
  message?: string | undefined | null;
  error?: string | undefined | null;
  data?: any[] | null | undefined | object | string;
  success?: boolean | undefined | null;
  editing?: boolean | undefined | null;
}

export const resData = ({
  message = null,
  error = null,
  data = null,
  success = null,
  editing = false,
}: ResDataOptions) => {
  if (
    (Array.isArray(data) && data.length < 1) ||
    (data && typeof data === 'object' && Object.keys(data).length < 1) ||
    !data
  ) {
    message = message ?? 'No data found';
    success = false;
    error = error ?? 'No data found';
  } else {
    message = message ?? 'Data retrieved successfully';
    success = success ?? true;
    error = error ?? null;
  }

  return {
    message,
    error,
    data,
    success,
    editing,
  };
};
