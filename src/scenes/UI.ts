import { Scene } from 'phaser'
import { HealthBar } from '../HealthBar'

export class UI extends Scene {
  constructor() {
    super('ui')
  }

  create(): void {
    new HealthBar(this, 100, 100, 300, 40, { defaultValue: 5, maxValue: 5 })
  }
}
