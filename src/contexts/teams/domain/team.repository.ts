import { TeamEntity } from "./team.entity.js";
import { MatchEntity } from "../../matches/domain/match.entity.js";

export interface TeamRepository {
  findAll(): Promise<TeamEntity[]>;
  findById(id: number): Promise<TeamEntity | null>;
  findMatchesByTeamId(teamId: number): Promise<MatchEntity[]>;
}
