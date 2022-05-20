export interface IStats {
  hp: number
  maxHp: number
  moves: number,
  maxMoves: number
}

export class HasStats {
  public stats!: IStats

  constructor(initialStats: IStats) { this.setStats(initialStats) }

  public setStats(stats: IStats) { this.stats = stats }
}
