import { Scene } from 'phaser'
import { Player } from '../Player'

const DEBUG = true

export class World extends Scene {
  constructor() { super('') }

  preload(): void {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 16, frameHeight: 16 })
    this.load.image('tilesetWorld', 'assets/tilesetWorld.png')
    this.load.tilemapTiledJSON('world', 'assets/worldMap.json')
  }

  create(): void {
    this.createMap()

    // Player
    const player = new Player(this, 3, 3)

    // Camera
    this.cameras.main.zoom = 5
    this.cameras.main.startFollow(player)

    // Colliders
    // this.physics.add.collider(player, wallsLayer)
  }

  private createMap(): void {
    const tilemap = this.make.tilemap({ key: 'world' })
    const tileset = tilemap.addTilesetImage('tilesetWorld', 'tilesetWorld')

    const wallsLayer = tilemap.createLayer('walls', tileset).setCollisionByProperty({ collides: true })
    const groundLayer = tilemap.createLayer('ground', tileset)

    if (DEBUG) {
      const debugGraphics = this.add.graphics().setAlpha(0.75)

      wallsLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      })
    }
  }
}
