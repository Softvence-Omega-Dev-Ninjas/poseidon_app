export const sendResponse = (
  message: string,
  data: any = null,
  statusCode: number = 200,
  redirect_url: string | null = null,
  error: string | null = null,
  success: boolean = true,
) => {
  return {
    message,
    data,
    statusCode,
    redirect_url,
    error,
    success,
  };
};
