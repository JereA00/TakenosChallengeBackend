export interface TeamPrimitives {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
  pot?: number;
}

export class TeamEntity {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly country: { id: number; name: string },
    readonly pot: number | undefined
  ) {}

  public static fromPrimitives(primitives: {
    id: number;
    name: string;
    country: { id: number; name: string };
    pot?: number;
  }): TeamEntity {
    return new TeamEntity(
      primitives.id,
      primitives.name,
      primitives.country,
      primitives.pot
    );
  }

  public toPrimitives(): TeamPrimitives {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      ...(this.pot !== undefined && { pot: this.pot }),
    };
  }
}
