import { Scene } from 'phaser'
import { Player } from '../Player'

export class World extends Scene {
  constructor() { super('') }

  preload(): void {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 18, frameHeight: 18, })
    this.load.image('tileset', 'assets/tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
  }

  create(): void {
    // Create map
    const tilemap = this.make.tilemap({ key: 'map' })
    const tileset = tilemap.addTilesetImage('tileset', 'tileset')

    const wallsLayer = tilemap.createLayer('walls', tileset).setCollisionByProperty({ collides: true })
    const groundLayer = tilemap.createLayer('ground', tileset)

    // Player
    const player = new Player(this, 40, 40)

    // Camera
    this.cameras.main.zoom = 5
    this.cameras.main.startFollow(player)

    // Colliders
    this.physics.add.collider(player, wallsLayer)
  }
}
