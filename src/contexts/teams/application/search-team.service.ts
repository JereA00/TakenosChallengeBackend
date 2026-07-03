import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { TeamRepository } from "../domain/team.repository.js";

@injectable()
export class SearchTeamService {
  constructor(
    @inject(TYPES.TeamRepository)
    private readonly teamRepository: TeamRepository
  ) {}

  async run(id: number): Promise<{ team: ReturnType<any>; matches: any[] } | null> {
    const team = await this.teamRepository.findById(id);
    if (!team) return null;

    const matches = await this.teamRepository.findMatchesByTeamId(id);

    return {
      team: team.toPrimitives(),
      matches: matches.map((m) => m.toPrimitives()),
    };
  }
}
