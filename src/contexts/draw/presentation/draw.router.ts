import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../../shared/container/container.js";
import { TYPES } from "../../../shared/container/types.js";
import { CreateDrawService } from "../application/create-draw.service.js";
import { SearchCurrentDrawService } from "../application/search-current-draw.service.js";
import { DeleteDrawService } from "../application/delete-draw.service.js";
import { DrawStatisticsService } from "../application/draw-statistics.service.js";
import { AppError } from "../../../shared/domain/exceptions/app-error.js";

export const drawRouter = Router();

drawRouter.post(
  "/draw",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drawService = container.get<CreateDrawService>(
        TYPES.CreateDrawService
      );
      await drawService.run();

      return res.status(201).json({ message: "Draw created successfully" });
    } catch (error) {
      if (error instanceof AppError && error.code === "DRAW_ALREADY_EXISTS") {
        return res.status(409).json({ message: error.message });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);

drawRouter.get(
  "/draw",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drawService = container.get<SearchCurrentDrawService>(
        TYPES.SearchCurrentDrawService
      );
      const draw = await drawService.run();

      if (!draw) {
        return res.status(404).json({ message: "No draw found" });
      }

      const drawPrimitives = draw.toPrimitives();

      return res.status(200).json(drawPrimitives);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);

drawRouter.get(
  "/draw/statistics",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = container.get<DrawStatisticsService>(TYPES.DrawStatisticsService);
      const stats = await service.run();

      if (!stats) {
        return res.status(404).json({ message: "No draw found" });
      }

      return res.status(200).json(stats);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);

drawRouter.delete(
  "/draw",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteDrawService = container.get<DeleteDrawService>(
        TYPES.DeleteDrawService
      );
      await deleteDrawService.run();

      return res.status(200).json({ message: "Draw deleted successfully" });
    } catch (error) {
      if (error instanceof AppError && error.code === "DRAW_NOT_FOUND") {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);
