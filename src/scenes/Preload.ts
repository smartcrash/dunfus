import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload(): void {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 18, frameHeight: 18 })
    this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 18, frameHeight: 18 })
    this.load.image('tileset', 'assets/tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
  }

  create(): void {
    this.scene.start('room')
  }
}
