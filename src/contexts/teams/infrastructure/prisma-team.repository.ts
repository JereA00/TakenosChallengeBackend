import { injectable } from "inversify";
import { PrismaRepository } from "../../../shared/infrastructure/prisma.repository.js";
import { TeamEntity } from "../domain/team.entity.js";
import { TeamRepository } from "../domain/team.repository.js";
import { MatchEntity } from "../../matches/domain/match.entity.js";

@injectable()
export class PrismaTeamRepository
  extends PrismaRepository<"Team">
  implements TeamRepository
{
  protected modelName = "Team" as const;

  async findAll(): Promise<TeamEntity[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        country: true,
        drawTeamPots: {
          orderBy: { drawId: "desc" },
          take: 1,
        },
      },
      orderBy: { id: "asc" },
    });

    return teams.map((team) => {
      if (!team.country) throw new Error(`Team ${team.id} has no country`);
      const pot = team.drawTeamPots[0]?.potId;
      return TeamEntity.fromPrimitives({
        id: team.id,
        name: team.name,
        country: { id: team.country.id, name: team.country.name },
        pot,
      });
    });
  }

  async findById(id: number): Promise<TeamEntity | null> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        country: true,
        drawTeamPots: {
          orderBy: { drawId: "desc" },
          take: 1,
        },
      },
    });

    if (!team) return null;
    if (!team.country) throw new Error(`Team ${id} has no country`);

    const pot = team.drawTeamPots[0]?.potId;
    return TeamEntity.fromPrimitives({
      id: team.id,
      name: team.name,
      country: { id: team.country.id, name: team.country.name },
      pot,
    });
  }

  async findMatchesByTeamId(teamId: number): Promise<MatchEntity[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: {
        homeTeam: { include: { country: true } },
        awayTeam: { include: { country: true } },
      },
      orderBy: [{ matchDay: "asc" }, { id: "asc" }],
    });

    return matches.map((match) => {
      if (!match.homeTeam.country || !match.awayTeam.country) {
        throw new Error(`Match ${match.id} has teams without country`);
      }
      return MatchEntity.fromPrimitives({
        id: match.id,
        drawId: match.drawId,
        homeTeam: {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          country: { id: match.homeTeam.country.id, name: match.homeTeam.country.name },
        },
        awayTeam: {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          country: { id: match.awayTeam.country.id, name: match.awayTeam.country.name },
        },
        matchDay: match.matchDay,
      });
    });
  }
}
