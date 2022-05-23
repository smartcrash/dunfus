export interface IStats {
  hp: number
  maxHp: number
  moves: number,
  maxMoves: number
  speed: number
  strength: number,
  range: number,
  attacks: number
  maxAttacks: number
}

export class HasStats {
  public stats!: IStats

  constructor(initialStats: IStats) { this.setStats(initialStats) }

  public setStats(stats: IStats) { this.stats = stats }
}
