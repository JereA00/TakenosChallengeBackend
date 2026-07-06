import { AppError } from "../../../../shared/domain/exceptions/app-error.js";

export const MatchErrors = {
  invalidPage: () =>
    new AppError("INVALID_PAGINATION", "Page must be greater than 0"),
};
