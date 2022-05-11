import { Scene } from 'phaser'
import { Player } from '../Player'

export class World extends Scene {
  constructor() { super('') }

  preload(): void {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 16, frameHeight: 16 })
  }

  create(): void {
    const player = new Player(this, 100, 100)

  }
}
