import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import {
  MatchRepository,
  MatchFilters,
  PaginationParams,
} from "../domain/match.repository.js";
import { MatchEntity } from "../domain/match.entity.js";
import { MatchErrors } from "../domain/exceptions/matches.errors.js";

export interface SearchMatchesParams {
  teamId?: number;
  matchDay?: number;
  page?: number;
  limit?: number;
  location?: "home" | "away";
  countryName?: string;
}

export interface SearchMatchesResult {
  matches: Array<{
    id: string;
    homeTeam: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
    awayTeam: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
    matchDay: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@injectable()
export class SearchMatchesService {
  constructor(
    @inject(TYPES.MatchRepository)
    private readonly matchRepository: MatchRepository
  ) {}

  async findById(id: number): Promise<MatchEntity | null> {
    return this.matchRepository.findById(id);
  }

  async run(params: SearchMatchesParams): Promise<SearchMatchesResult> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;

    if (page < 1) {
      throw MatchErrors.invalidPage();
    }

    const validatedLimit = limit > 100 ? 10 : limit;

    const filters: MatchFilters = {};
    if (params.teamId) {
      filters.teamId = params.teamId;
    }
    if (params.matchDay) {
      filters.matchDay = params.matchDay;
    }
    if (params.location) {
      filters.location = params.location;
    }
    if (params.countryName) {
      filters.countryName = params.countryName;
    }

    console.log(`[SearchMatchesService] Searching matches with filters: ${JSON.stringify(filters)}, page=${page}, limit=${validatedLimit}`);

    const pagination: PaginationParams = {
      page,
      limit: validatedLimit,
    };

    const { matches, total } = await this.matchRepository.findAll(
      filters,
      pagination
    );

    const totalPages = Math.ceil(total / validatedLimit);

    const matchesPrimitives = matches.map((match) => match.toPrimitives());

    return {
      matches: matchesPrimitives,
      pagination: {
        page,
        limit: validatedLimit,
        total,
        totalPages,
      },
    };
  }
}
