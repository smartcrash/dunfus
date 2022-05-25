import { Grid } from 'pathfinding'
import { Scene } from 'phaser'
import { Battle } from '../Batte'
import { Helpers } from '../Helpers'
import { Player } from '../Player'
import { Slime } from '../Slime'

export class Room extends Scene {
  constructor() {
    super('room')
  }

  create(): void {
    const tilemap = this.createMap()
    const grid = new Grid(tilemap.width, tilemap.height)

    tilemap.forEachTile(({ properties, x, y }) => grid.setWalkableAt(x, y, !properties.collides))

    // Player
    const player = new Player(this, Helpers.tileToWorldX(2), Helpers.tileToWorldY(2))

    // Slime
    const slime = new Slime(this, Helpers.tileToWorldX(5), Helpers.tileToWorldY(5))

    // Camera
    const camera = this.cameras.main

    camera.startFollow(player)

    // Colliders
    this.physics.add.collider(player, tilemap.getLayer(0).tilemapLayer)

    // TODO: Create `createBattle` function

    const battle = new Battle(this, grid, [player, slime])
    battle.start()
  }

  private createMap(): Phaser.Tilemaps.Tilemap {
    const tilemap = this.make.tilemap({ key: 'map' })
    const tileset = tilemap.addTilesetImage('tileset', 'tileset')

    tilemap.createLayer(0, tileset).setCollisionByProperty({ collides: true })

    return tilemap
  }
}
