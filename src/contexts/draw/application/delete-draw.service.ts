import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { DrawRepository } from "../domain/draw.repository.js";
import { DrawErrors } from "../domain/exceptions/draw.errors.js";

@injectable()
export class DeleteDrawService {
  constructor(
    @inject(TYPES.DrawRepository)
    private readonly drawRepository: DrawRepository
  ) {}

  public async run(): Promise<void> {
    const existing = await this.drawRepository.searchCurrent();
    if (!existing) {
      throw DrawErrors.notFound();
    }

    await this.drawRepository.deleteAll();
  }
}
