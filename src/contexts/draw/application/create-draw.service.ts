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
    const existing = await this.drawRepository.searchCurrent();
    if (existing) {
      console.warn("[CreateDrawService] Draw already exists, aborting");
      throw DrawErrors.alreadyExists();
    }

    const teams = await this.drawRepository.findAllTeams();

    const potAssignments = PotAssigner.fromTeamList(teams);
    const draw = Draw.create(teams, potAssignments);

    await this.drawRepository.save(draw);
  }
}
