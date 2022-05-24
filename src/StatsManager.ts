import { capitalize } from 'lodash-es'

export interface Stats {
  maxHp: number
  maxMoves: number
  maxAttacks: number

  hp: number
  moves: number
  range: number
  attacks: number

  speed: number
  strength: number
}

export class StatsManager implements Stats {
  public maxHp = 0
  public maxMoves = 0
  public maxAttacks = 0
  public hp = 0
  public moves = 0
  public speed = 0
  public strength = 0
  public range = 0
  public attacks = 0

  constructor(defaultStats: Partial<Stats>) {
    Object.assign(this, defaultStats)
  }

  increase(key: keyof Stats, amount: number): void {
    this[key] += amount
  }

  decrease(key: keyof Stats, amount: number): void {
    this[key] = Math.max(this[key] - amount, 0)
  }

  set(key: keyof Stats, value: number): void {
    const limitKey = `max${capitalize(key)}`
    const maxValue: number =
      limitKey in this ? (this[limitKey as keyof this] as any as number) : Infinity

    this[key] = Math.min(value, maxValue)
  }

  reset(key: 'hp' | 'moves' | 'attacks'): void {
    const limitKey = `max${capitalize(key)}`
    const maxValue: number =
      limitKey in this ? (this[limitKey as keyof this] as any as number) : Infinity
    this[key] = maxValue
  }
}
