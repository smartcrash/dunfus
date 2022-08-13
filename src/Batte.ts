import { isEqual, last } from 'lodash-es'
import { Grid } from 'pathfinding'
import { Enemy } from './Enemy'
import { EVENTS, eventsCenter } from './EventsCenter'
import { Helpers } from './Helpers'
import { isEnemy } from './helpers/isEnemy'
import { isPartyMember } from './helpers/isPartyMember'
import { PartyMember } from './PartyMember'
import { TurnQueue } from './TurnQueue'
import { Unit } from './Unit'

function closest<T extends Phaser.Types.Math.Vector2Like>(
  worldX: number,
  worldY: number,
  points: T[]
): T {
  const point = new Phaser.Math.Vector2(worldX, worldY)
  let i = -1
  let d = Infinity

  points.forEach(({ x, y }, index) => {
    if (!point.equals({ x, y }) && point.distance({ x, y }) < d) {
      d = point.distance({ x, y })
      i = index
    }
  })

  return points[i]
}

function includes(list: any[], needle: any): boolean {
  return list.some((item) => isEqual(item, needle))
}

export class Battle {
  private turnQueue: TurnQueue
  public partyMembers: PartyMember[]
  public enemies: Enemy[]

  constructor(private scene: Phaser.Scene, private grid: Grid, public units: Unit[]) {
    this.turnQueue = new TurnQueue(this.units)
    this.partyMembers = units.filter(isPartyMember)
    this.enemies = units.filter(isEnemy)
  }

  private async turn() {
    this.onBegin()

    const { current } = this.turnQueue

    if (isEnemy(current)) {
      await this.playTurn()
    }
  }

  /** AI decide what to do next */
  private async playTurn(): Promise<void> {
    const { current } = this.turnQueue
    const { stats } = current

    const hasAttacks = !!stats.attacks
    const hasMoves = !!stats.moves

    if (!hasAttacks && !hasMoves) {
      this.endTurn()
      return
    }

    const target = closest(current.x, current.y, this.partyMembers)

    const { x: tileX, y: tileY } = Helpers.worldToTileXY(current.x, current.y)
    const { x: targetX, y: targetY } = Helpers.worldToTileXY(target.x, target.y)

    this.grid.setWalkableAt(targetX, targetY, true)

    const isAtRange = includes(current.getAttackableTiles(this.grid), [targetX, targetY])

    if (isAtRange) {
      if (!hasAttacks) return this.endTurn()

      this.attack(targetX, targetY)
    } else {
      if (!hasMoves) return this.endTurn()

      const path = Helpers.findPath(tileX, tileY, targetX, targetY, this.grid)

      // Make sure that the last point is not occupied by the target,
      // if it is, remove it
      if (isEqual(last(path), [targetX, targetY])) {
        path.pop()
      }

      // The first element of the array always is the inital position
      path.shift()

      const [endX, endY] = last(path.slice(0, stats.moves))!

      await this.moveTo(endX, endY)
    }

    this.grid.setWalkableAt(targetX, targetY, false)
    this.playTurn()
  }

  private endIf(): boolean {
    const { current } = this.turnQueue
    const { stats } = current

    if (isPartyMember(current)) {
      if (!stats.moves) return true
    }

    return false
  }

  private endTurn() {
    this.turnQueue.next()
    this.turn()

    const { current } = this.turnQueue
    eventsCenter.emit(EVENTS.TURN_END, { current })
  }

  public async start() {
    this.attachListeners()
    this.turn()
  }

  private attachListeners() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const { current } = this.turnQueue
      const isPartyMemberTurn = isPartyMember(current)

      if (isPartyMemberTurn) {
        const { worldX, worldY } = pointer
        const { x: tileX, y: tileY } = Helpers.worldToTileXY(worldX, worldY)

        if (this.isOcupied(tileX, tileY)) this.attack(tileX, tileY)
        else this.moveTo(tileX, tileY)
      }
    })
  }

  private async onBegin() {
    const { current } = this.turnQueue
    const { stats } = current

    // Reset stats
    stats.reset('moves')
    stats.reset('attacks')

    eventsCenter.emit(EVENTS.TURN_START, { current })
  }

  private async onMove() {
    eventsCenter.emit(EVENTS.MOVE_END)

    if (this.endIf()) this.endTurn()
  }

  //
  // Moves
  //

  /** Move an unit to tile XY coordinates */
  private async moveTo(tileX: number, tileY: number) {

    const { current } = this.turnQueue
    const { stats } = current
    const { x: startX, y: startY } = Helpers.worldToTileXY(current.x, current.y)

    const isValid = includes(current.getMovableTiles(this.grid), [tileX, tileY])

    if (isValid) {
      eventsCenter.emit(EVENTS.MOVE_START, 'moveTo', tileX, tileY)

      const { length } = await current.moveTo(tileX, tileY, this.grid)
      stats.decrease('moves', length - 1)
    } else {
      console.log('INVALID_MOVE :>>', 'moveTo', { startX, startY, tileX, tileY })
    }

    this.onMove()
  }

  private attack(tileX: number, tileY: number) {
    const { current } = this.turnQueue
    const { stats } = current

    const target = this.unitAt(tileX, tileY)
    const isValid = includes(current.getAttackableTiles(this.grid), [tileX, tileY]) && target && stats.attacks

    if (isValid) {
      eventsCenter.emit(EVENTS.MOVE_START, 'attack', tileX, tileY)
      target.hit(stats.strength)
      stats.decrease('attacks', 1)
    } else {
      console.log('INVALID_MOVE :>>', 'attack', { tileX, tileY })
    }

    this.onMove()
  }

  // Helpers
  private unitAt(tileX: number, tileY: number): Unit | undefined {
    return this.units.find((o) => o.tileX === tileX && o.tileY === tileY)
  }

  private isOcupied(tileX: number, tileY: number): boolean {
    return this.units.some((o) => o.tileX === tileX && o.tileY === tileY)
  }
}
