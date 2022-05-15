import { Scene } from 'phaser';
import { PathFindingGrid } from '../PathFindingGrid';
import { Player } from '../Player';


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

    tilemap.createLayer(0, tileset).setCollisionByProperty({ collides: true })

    const grid = new PathFindingGrid(tilemap)

    // Player
    const player = new Player(this, 40, 40, grid)
    const camera = this.cameras.main

    // Camera
    camera.zoom = 5
    camera.startFollow(player)

    // Colliders
    this.physics.add.collider(player, tilemap.getLayer(0).tilemapLayer)
  }
}
