/**
 * CUSTOM ERROR CLASSES
 * Source of truth: ARCHITECTURE.md Section 36
 * 
 * Stable application error codes for API responses.
 * Internal errors must NOT expose SQL, stack traces, secrets.
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// ========================================
// 400 — Bad Request / Validation
// ========================================
export class ValidationError extends AppError {
  constructor(message: string = 'Data tidak valid') {
    super('VALIDATION_ERROR', message, 400);
  }
}

// ========================================
// 401 — Unauthorized
// ========================================
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Silakan login terlebih dahulu') {
    super('UNAUTHORIZED', message, 401);
  }
}

// ========================================
// 403 — Forbidden
// ========================================
export class ForbiddenError extends AppError {
  constructor(message: string = 'Anda tidak memiliki akses ke resource ini') {
    super('FORBIDDEN', message, 403);
  }
}

// ========================================
// 404 — Not Found
// ========================================
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource tidak ditemukan') {
    super('NOT_FOUND', message, 404);
  }
}

// ========================================
// 409 — Conflict
// ========================================
export class ConflictError extends AppError {
  constructor(message: string = 'Resource sudah ada') {
    super('CONFLICT', message, 409);
  }
}

// ========================================
// 422 — Unprocessable Entity
// ========================================
export class UnprocessableError extends AppError {
  constructor(message: string = 'Data tidak dapat diproses') {
    super('UNPROCESSABLE', message, 422);
  }
}

// ========================================
// 429 — Rate Limited
// ========================================
export class RateLimitError extends AppError {
  constructor(message: string = 'Terlalu banyak request, coba lagi nanti') {
    super('RATE_LIMITED', message, 429);
  }
}

// ========================================
// 500 — Internal Server Error
// ========================================
export class InternalError extends AppError {
  constructor(message: string = 'Terjadi kesalahan internal') {
    super('INTERNAL_ERROR', message, 500, false);
  }
}

// ========================================
// Domain-specific errors
// ========================================
export class InvitationNotFoundError extends NotFoundError {
  constructor(slug?: string) {
    super(slug ? `Invitation "${slug}" tidak ditemukan` : 'Invitation tidak ditemukan');
  }
}

export class InvitationNotPublishedError extends AppError {
  constructor() {
    super('INVITATION_NOT_PUBLISHED', 'Undangan ini belum dipublikasikan', 404);
  }
}

export class GuestTokenInvalidError extends UnauthorizedError {
  constructor() {
    super('Token tamu tidak valid atau sudah kedaluwarsa');
  }
}

export class SlugConflictError extends ConflictError {
  constructor(slug: string) {
    super(`Slug "${slug}" sudah digunakan. Pilih slug lain.`);
  }
}

export class RSVPValidationError extends ValidationError {
  constructor(message: string = 'Data RSVP tidak valid') {
    super(message);
  }
}

export class AssetNotFoundError extends NotFoundError {
  constructor() {
    super('Asset tidak ditemukan');
  }
}
