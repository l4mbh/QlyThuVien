export const ErrorCode = {
  SUCCESS: 0,
  UNAUTHORIZED: 401001,
  NOT_FOUND: 404001,
  INTERNAL_SERVER_ERROR: 500001,
  VALIDATION_ERROR: 400001,
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = typeof StatusCode[keyof typeof StatusCode];
