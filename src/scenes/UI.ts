import { Grid } from 'pathfinding'
import { Scene } from 'phaser'
import Constants from '../Constants'
import { EVENTS, eventsCenter } from '../EventsCenter'
import { Helpers } from '../Helpers'
import { isPartyMember } from '../helpers/isPartyMember'
import { Unit } from '../Unit'

export class UI extends Scene {
  private grid!: Grid
  private parentScene!: Phaser.Scene
  private current: Unit | undefined = undefined

  private markersGroup!: Phaser.GameObjects.Group

  constructor() { super('ui') }

  init(data: any): void {
    this.grid = data.grid as Grid
    this.parentScene = data.scene as Phaser.Scene
    this.markersGroup = this.parentScene.add.group({ classType: Phaser.GameObjects.Rectangle })
  }

  create(): void {
    eventsCenter.addListener(EVENTS.TURN_START, this.onTurnStart, this)
    eventsCenter.addListener(EVENTS.TURN_END, this.onTurnEnd, this)
    // eventsCenter.addListener(EVENTS., this.onTurnEnd, this)
  }

  update(): void {
    const { current } = this

    if (!current) return

    // TODO: Move this logic to onMove event handler
    if (isPartyMember(current)) {
      const isMoving = !!current.body.velocity.length()

      if (isMoving) {
        this.clearMarkers()
      } else {
        if (!this.markersGroup.getLength()) {
          this.showMovableTiles(current)
          this.showAttackableTiles(current)
        }
      }
    }
  }


  private onTurnStart({ current }: { current: Unit }) {
    this.current = current
  }

  private onTurnEnd({ current }: { current: Unit }) {
    //
  }

  private showMovableTiles(unit: Unit): void {
    for (const tile of unit.getMovableTiles(this.grid)) {
      const { x, y } = Helpers.tileToWorldXY(tile[0], tile[1])
      this.addMarkerAt('move', x, y)
    }
  }

  private showAttackableTiles(unit: Unit): void {
    if (unit.stats.attacks) {
      for (const tile of unit.getAttackableTiles(this.grid)) {
        const { x, y } = Helpers.tileToWorldXY(tile[0], tile[1])
        this.addMarkerAt('attack', x, y)
      }
    }
  }

  private addMarkerAt(type: 'move' | 'attack', worldX: number, worldY: number): void {
    const { tileWidth, tileHeight } = Constants
    let rect: Phaser.GameObjects.Rectangle

    switch (type) {
      case 'move':
        rect = this.parentScene.add
          .rectangle(worldX, worldY, tileWidth - 6, tileHeight - 6)
          .setStrokeStyle(1, 0xffffff)
        break;
      case 'attack':
        rect = this.parentScene.add
          .rectangle(worldX, worldY, tileWidth - 11, tileHeight - 11, 0xff00000)
        break;
    }

    this.markersGroup.add(rect)
  }

  private clearMarkers(): void {
    this.markersGroup.clear(true, true)
  }
}
