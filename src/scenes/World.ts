import { Scene } from 'phaser'
import { Player } from '../Player'

export class World extends Scene {
  constructor() {
    super('')
  }

  preload() {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 16, frameHeight: 16 })
  }

  create() {
    const hero = new Player(this, 100, 100)
  }
}
