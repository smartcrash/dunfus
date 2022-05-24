import { Unit } from './Unit'

export class TurnQueue {
  index: number

  constructor(private units: Unit[]) {
    this.units.sort((a, b) =>
      a.stats.speed < b.stats.speed ? 1 : a.stats.speed > b.stats.speed ? -1 : 0
    )
    this.index = 0
  }

  next() {
    this.index = (this.index + 1) % this.units.length
  }

  get current() {
    return this.units[this.index]
  }
}
