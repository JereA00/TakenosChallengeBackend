import { Request, Response, NextFunction } from "express";
import { AppError } from "../domain/exceptions/app-error.js";

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    console.error(`[${err.code}] ${req.method} ${req.path} — ${err.message}`);
    res.status(400).json({ code: err.code, message: err.message });
    return;
  }

  console.error(`[UNHANDLED_ERROR] ${req.method} ${req.path}`, err);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "An unexpected error occurred" });
}
