import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../../shared/container/container.js";
import { TYPES } from "../../../shared/container/types.js";
import { SearchTeamsService } from "../application/search-teams.service.js";
import { SearchTeamService } from "../application/search-team.service.js";

export const teamsRouter = Router();

teamsRouter.get(
  "/teams",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const service = container.get<SearchTeamsService>(TYPES.SearchTeamsService);
      const teams = await service.run();
      return res.status(200).json(teams);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);

teamsRouter.get(
  "/teams/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team id" });
      }

      const service = container.get<SearchTeamService>(TYPES.SearchTeamService);
      const result = await service.run(id);

      if (!result) {
        return res.status(404).json({ message: "Team not found" });
      }

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);
