export type ApiResponse<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T;
};

export type ApiListResponse<T> = {
  items: T[];
  totalData?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPage?: number;
};

export type ApiErrorPayload = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};