/**
 * STANDARD API RESPONSE
 * Source of truth: ARCHITECTURE.md Section 36
 * 
 * Every API endpoint returns consistent response format.
 * Never return raw database rows.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(data: T, status: number = 200): Response {
  const body: ApiResponse<T> = { success: true, data };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createdResponse<T>(data: T): Response {
  return successResponse(data, 201);
}

export function noContentResponse(): Response {
  return new Response(null, { status: 204 });
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
): Response {
  const body: ApiResponse = {
    success: false,
    error: { code, message },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response {
  const body: ApiResponse<T[]> = {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
