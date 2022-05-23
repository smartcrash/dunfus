import { Scene } from 'phaser';
import { HealthBar } from '../HealthBar';
import { Unit } from '../Unit';

export class UI extends Scene {
  private player!: Unit

  constructor() {
    super('ui')
  }

  init(data: { player: Unit }) {
    this.player = data.player
  }

  create(): void {
    const { hp, maxHp } = this.player.stats
    const healthBar = new HealthBar(this, 100, 100, 300, 40, { defaultValue: hp, maxValue: maxHp })

    this.player.on(Unit.Events.HIT, (value: number) => healthBar.setValue(value))
  }
}
