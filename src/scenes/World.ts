import { Scene } from 'phaser'
import { Player } from '../Player'

const DEBUG = false

export class World extends Scene {
  constructor() { super('') }

  preload(): void {
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 16, frameHeight: 16 })

    this.load.image('tilesetWorld', 'assets/tilesets/world.png')
    this.load.image('tilesetDungeon', 'assets/tilesets/dungeon.png')

    this.load.tilemapTiledJSON('dungeon', 'assets/dungeon.json')
  }

  create(): void {
    // Create map

    const map = this.make.tilemap({ key: 'dungeon' })
    const tilemap = map.addTilesetImage('dungeon', 'tilesetDungeon')

    const wallsLayer = map.createLayer('walls', tilemap).setCollisionByProperty({ collides: true })
    const groundLayer = map.createLayer('ground', tilemap)


    if (DEBUG) {
      const debugGraphics = this.add.graphics().setAlpha(0.75);

      wallsLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    }

    // Player
    const player = new Player(this, 100, 100)

    // Camera
    this.cameras.main.zoom = 5
    this.cameras.main.startFollow(player)

    // Colliders
    this.physics.add.collider(player, wallsLayer)
  }
}
