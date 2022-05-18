import { Scene } from 'phaser';
import { Battle } from '../Battle';
import { PathFindingGrid } from '../PathFindingGrid';
import { Player } from '../Player';
import { Slime } from '../Slime';


export class Room extends Scene {
  constructor() { super('room') }

  create(): void {
    this.scene.run('ui')

    const tilemap = this.createMap()
    const grid = new PathFindingGrid(tilemap)

    // Player
    const { x: iniX, y: iniY } = grid.tileToWorldXY(2, 2)
    const player = new Player(this, iniX, iniY)

    const camera = this.cameras.main

    camera.zoom = 5
    camera.startFollow(player)


    // Colliders
    this.physics.add.collider(player, tilemap.getLayer(0).tilemapLayer)

    // Enemy
    const slime = new Slime(this, grid.tileToWorldX(5), grid.tileToWorldY(5))

    const battle = new Battle({ units: [player, slime] })
    battle.start()
  }

  private createMap(): Phaser.Tilemaps.Tilemap {
    const tilemap = this.make.tilemap({ key: 'map' })
    const tileset = tilemap.addTilesetImage('tileset', 'tileset')

    tilemap.createLayer(0, tileset).setCollisionByProperty({ collides: true })

    return tilemap
  }
}
