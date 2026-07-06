import { AppError } from "../../../../shared/domain/exceptions/app-error.js";

export const DrawErrors = {
  alreadyExists: () =>
    new AppError("DRAW_ALREADY_EXISTS", "A draw already exists"),
  notFound: () =>
    new AppError("DRAW_NOT_FOUND", "No draw found"),
  generationFailed: () =>
    new AppError("DRAW_GENERATION_FAILED", "No valid draw exists for the given team configuration"),
  invalidTeamCount: (expected: number, received: number) =>
    new AppError("INVALID_TEAM_COUNT", `Expected ${expected} teams, got ${received}`),
  matchReferencesNonExistentTeam: () =>
    new AppError("MATCH_INVALID_TEAM_REFERENCE", "Match references non-existent team"),
};
