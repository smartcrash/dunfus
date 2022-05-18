export interface IStats {
  hp: number
  maxHp: number
}

export class HasStats {
  public stats: IStats
  constructor(maxHp: number, hp: number = maxHp) {
    this.stats = {
      hp,
      maxHp
    }
  }
}
