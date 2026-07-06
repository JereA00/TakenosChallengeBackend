import { Team } from "../team.js";
import { Match } from "../match.js";
import { DrawErrors } from "../exceptions/draw.errors.js";

const MAX_MATCHES = 8;
const MAX_HOME = 4;
const MAX_AWAY = 4;
const MATCH_DAYS = 8;
const MAX_COUNTRY_OPPONENTS = 2;

type TeamState = {
  opponents: Set<number>;
  matches: number;
  home: number;
  away: number;
  matchDays: Set<number>;
  opponentCountries: Map<number, number>;
};

export class DrawService {
  static generateMatches(teams: Team[], drawId: number): Match[] {
    const states = new Map<number, TeamState>();
    for (const team of teams) {
      states.set(team.id, {
        opponents: new Set(),
        matches: 0,
        home: 0,
        away: 0,
        matchDays: new Set(),
        opponentCountries: new Map(),
      });
    }

    const matches: Match[] = [];
    const matchIdCounter = { value: 1 };

    const success = this.backtrackMatchDay(1, teams, states, matches, drawId, matchIdCounter);

    if (!success) {
      console.error("[DrawService] No valid draw exists for the given team configuration — constraints are unsatisfiable");
      throw DrawErrors.generationFailed();
    }

    return matches;
  }

  private static backtrackMatchDay(
    matchDay: number,
    teams: Team[],
    states: Map<number, TeamState>,
    matches: Match[],
    drawId: number,
    matchIdCounter: { value: number }
  ): boolean {
    if (matchDay > MATCH_DAYS) {
      return true;
    }

    const remainingTeams = teams.filter((t) => {
      const teamState = states.get(t.id)!;
      return !teamState.matchDays.has(matchDay) && teamState.matches < MAX_MATCHES;
    });

    return this.backtrackPairings(matchDay, remainingTeams, teams, states, matches, drawId, matchIdCounter);
  }

  private static backtrackPairings(
    matchDay: number,
    remainingTeams: Team[],
    allTeams: Team[],
    states: Map<number, TeamState>,
    matches: Match[],
    drawId: number,
    matchIdCounter: { value: number }
  ): boolean {
    if (remainingTeams.length === 0) {
      return this.backtrackMatchDay(matchDay + 1, allTeams, states, matches, drawId, matchIdCounter);
    }

    // Pick the most constrained remaining team (fewest valid opponents)
    const teamA = this.getMostConstrained(remainingTeams, states);
    const restAfterTeamA = remainingTeams.filter((t) => t.id !== teamA.id);

    const candidates = this.getValidCandidates(teamA, restAfterTeamA, states);

    if (candidates.length === 0) {
      console.warn(
        `[DrawService] No valid candidates for team "${teamA.name}" (id=${teamA.id}) on match day ${matchDay}, backtracking...`
      );
      return false;
    }

    // Sort candidates by most constrained first (fewest valid opponents)
    const sortedCandidates = [...candidates].sort((a, b) => {
      const othersForTeamA = restAfterTeamA.filter((t) => t.id !== a.id);
      const othersForTeamB = restAfterTeamA.filter((t) => t.id !== b.id);
      return (
        this.getValidCandidates(a, othersForTeamA, states).length -
        this.getValidCandidates(b, othersForTeamB, states).length
      );
    });

    for (const teamB of sortedCandidates) {
      const stateA = states.get(teamA.id)!;
      const stateB = states.get(teamB.id)!;

      const canHome = stateA.home < MAX_HOME && stateB.away < MAX_AWAY;
      const canAway = stateA.away < MAX_AWAY && stateB.home < MAX_HOME;

      // Try both home/away orientations — backtrack if either leads to a dead end
      const homeOptions: boolean[] = [];
      if (canHome) homeOptions.push(true);
      if (canAway) homeOptions.push(false);

      for (const isHome of homeOptions) {
        const matchId = matchIdCounter.value++;
        const match = Match.create(
          matchId,
          drawId,
          isHome ? teamA.id : teamB.id,
          isHome ? teamB.id : teamA.id,
          matchDay
        );
        matches.push(match);
        this.applyMatch(teamA, teamB, isHome, matchDay, states);

        const nextRemaining = restAfterTeamA.filter((t) => t.id !== teamB.id);
        if (this.backtrackPairings(matchDay, nextRemaining, allTeams, states, matches, drawId, matchIdCounter)) {
          return true;
        }

        // Undo and try next
        matches.pop();
        matchIdCounter.value--;
        this.undoMatch(teamA, teamB, isHome, matchDay, states);
      }
    }

    return false;
  }

  private static getMostConstrained(remainingTeams: Team[], states: Map<number, TeamState>): Team {
    let mostConstrained = remainingTeams[0];
    let minOptions = Infinity;

    for (const team of remainingTeams) {
      const candidates = remainingTeams.filter((t) => t.id !== team.id);
      const count = this.getValidCandidates(team, candidates, states).length;
      if (count < minOptions) {
        minOptions = count;
        mostConstrained = team;
      }
    }

    return mostConstrained;
  }

  private static getValidCandidates(teamA: Team, candidates: Team[], states: Map<number, TeamState>): Team[] {
    const stateA = states.get(teamA.id)!;
    return candidates.filter((teamB) => {
      const stateB = states.get(teamB.id)!;
      if (stateB.matches >= MAX_MATCHES) return false;
      if (stateA.opponents.has(teamB.id)) return false;
      if (teamA.country.id === teamB.country.id) return false;

      const aCountFromB = stateA.opponentCountries.get(teamB.country.id) || 0;
      const bCountFromA = stateB.opponentCountries.get(teamA.country.id) || 0;
      if (aCountFromB >= MAX_COUNTRY_OPPONENTS || bCountFromA >= MAX_COUNTRY_OPPONENTS) return false;

      const canHome = stateA.home < MAX_HOME && stateB.away < MAX_AWAY;
      const canAway = stateA.away < MAX_AWAY && stateB.home < MAX_HOME;
      return canHome || canAway;
    });
  }

  private static applyMatch(
    teamA: Team,
    teamB: Team,
    isHome: boolean,
    matchDay: number,
    states: Map<number, TeamState>
  ): void {
    const stateA = states.get(teamA.id)!;
    const stateB = states.get(teamB.id)!;

    stateA.opponents.add(teamB.id);
    stateB.opponents.add(teamA.id);
    stateA.matchDays.add(matchDay);
    stateB.matchDays.add(matchDay);
    stateA.matches++;
    stateB.matches++;

    if (isHome) {
      stateA.home++;
      stateB.away++;
    } else {
      stateA.away++;
      stateB.home++;
    }

    stateA.opponentCountries.set(teamB.country.id, (stateA.opponentCountries.get(teamB.country.id) || 0) + 1);
    stateB.opponentCountries.set(teamA.country.id, (stateB.opponentCountries.get(teamA.country.id) || 0) + 1);
  }

  private static undoMatch(
    teamA: Team,
    teamB: Team,
    isHome: boolean,
    matchDay: number,
    states: Map<number, TeamState>
  ): void {
    const stateA = states.get(teamA.id)!;
    const stateB = states.get(teamB.id)!;

    stateA.opponents.delete(teamB.id);
    stateB.opponents.delete(teamA.id);
    stateA.matchDays.delete(matchDay);
    stateB.matchDays.delete(matchDay);
    stateA.matches--;
    stateB.matches--;

    if (isHome) {
      stateA.home--;
      stateB.away--;
    } else {
      stateA.away--;
      stateB.home--;
    }

    const aCount = (stateA.opponentCountries.get(teamB.country.id) || 0) - 1;
    if (aCount <= 0) stateA.opponentCountries.delete(teamB.country.id);
    else stateA.opponentCountries.set(teamB.country.id, aCount);

    const bCount = (stateB.opponentCountries.get(teamA.country.id) || 0) - 1;
    if (bCount <= 0) stateB.opponentCountries.delete(teamA.country.id);
    else stateB.opponentCountries.set(teamA.country.id, bCount);
  }
}
