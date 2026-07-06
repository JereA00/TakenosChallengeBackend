import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { Draw } from "../domain/draw.js";
import { DrawRepository } from "../domain/draw.repository.js";
import { PotAssigner } from "../domain/application/pot-assigner.service.js";
import { DrawErrors } from "../domain/exceptions/draw.errors.js";

@injectable()
export class CreateDrawService {
  constructor(
    @inject(TYPES.DrawRepository)
    private readonly drawRepository: DrawRepository
  ) {}

  public async run(): Promise<void> {
    console.log("[CreateDrawService] Checking for existing draw...");
    const existing = await this.drawRepository.searchCurrent();
    if (existing) {
      console.warn("[CreateDrawService] Draw already exists, aborting");
      throw DrawErrors.alreadyExists();
    }

    console.log("[CreateDrawService] Fetching teams...");
    const teams = await this.drawRepository.findAllTeams();
    console.log(`[CreateDrawService] ${teams.length} teams loaded`);

    const potAssignments = PotAssigner.fromTeamList(teams);
    const draw = Draw.create(teams, potAssignments);

    console.log("[CreateDrawService] Saving draw...");
    await this.drawRepository.save(draw);
    console.log("[CreateDrawService] Draw saved successfully");
  }
}
