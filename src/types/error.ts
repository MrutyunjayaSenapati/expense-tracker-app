export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  retryable?: boolean;
}
