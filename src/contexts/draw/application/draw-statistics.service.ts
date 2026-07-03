import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { DrawRepository } from "../domain/draw.repository.js";

export interface DrawStatistics {
  drawId: number;
  createdAt: string;
  totalMatches: number;
  matchesPerMatchDay: Record<number, number>;
  matchesPerPot: Record<number, number>;
  teamsPerPot: Record<number, number>;
}

@injectable()
export class DrawStatisticsService {
  constructor(
    @inject(TYPES.DrawRepository)
    private readonly drawRepository: DrawRepository
  ) {}

  async run(): Promise<DrawStatistics | null> {
    const draw = await this.drawRepository.searchCurrent();
    if (!draw) return null;

    const primitives = draw.toPrimitives();

    const matchesPerMatchDay: Record<number, number> = {};
    const matchesPerPot: Record<number, number> = {};

    for (const match of primitives.matches) {
      matchesPerMatchDay[match.matchDay] = (matchesPerMatchDay[match.matchDay] ?? 0) + 1;
    }

    const teamsPerPot: Record<number, number> = {};
    for (const pot of primitives.pots) {
      teamsPerPot[pot.id] = pot.teams.length;
    }

    for (const pot of primitives.pots) {
      let count = 0;
      for (const team of pot.teams) {
        count += primitives.matches.filter(
          (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
        ).length;
      }
      matchesPerPot[pot.id] = count;
    }

    return {
      drawId: primitives.id!,
      createdAt: primitives.createdAt.toISOString(),
      totalMatches: primitives.matches.length,
      matchesPerMatchDay,
      matchesPerPot,
      teamsPerPot,
    };
  }
}
