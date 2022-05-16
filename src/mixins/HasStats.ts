export interface IStats {
  hp: number
  maxHp: number
}

export class HasStats {
  constructor(public maxHp: number, public hp: number = maxHp) { }
}
