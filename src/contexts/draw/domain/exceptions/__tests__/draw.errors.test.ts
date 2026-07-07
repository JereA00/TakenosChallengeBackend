import { describe, it, expect } from 'vitest';
import { DrawErrors } from '../draw.errors';
import { AppError } from '../../../../../shared/domain/exceptions/app-error';

describe('DrawErrors', () => {
  it('alreadyExists returns AppError with DRAW_ALREADY_EXISTS code', () => {
    const error = DrawErrors.alreadyExists();
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('DRAW_ALREADY_EXISTS');
  });

  it('notFound returns AppError with DRAW_NOT_FOUND code', () => {
    const error = DrawErrors.notFound();
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('DRAW_NOT_FOUND');
  });
});
