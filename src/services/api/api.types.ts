export type ApiResponse<T> = {
  success: boolean;
  message: string;
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
  message?: string;
  errors?: Record<string, string[]>;
};
