import { Team } from "../team.js";
import { DrawErrors } from "../exceptions/draw.errors.js";

export class PotAssigner {
  static readonly POTS = 4;
  static readonly TEAMS_PER_POT = 9;
  static readonly EXPECTED_TEAMS = PotAssigner.POTS * PotAssigner.TEAMS_PER_POT;

  static fromTeamList(teams: Team[]): Map<number, number> {
    if (teams.length !== PotAssigner.EXPECTED_TEAMS) {
      throw DrawErrors.invalidTeamCount(PotAssigner.EXPECTED_TEAMS, teams.length);
    }

    const assignments = new Map<number, number>();

    teams.forEach((team, index) => {
      const pot = Math.floor(index / this.TEAMS_PER_POT) + 1;
      assignments.set(team.id, pot);
    });

    return assignments;
  }
}
