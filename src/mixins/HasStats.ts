export interface IStats {
  hp: number
  maxHp: number
}

export class HasStats {
  public stats!: IStats

  constructor(maxHp: number, hp: number = maxHp) {
    this.setStats({
      maxHp,
      hp
    })
  }

  public setStats(stats: IStats) {
    this.stats = stats
  }
}
