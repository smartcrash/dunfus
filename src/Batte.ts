import { isEqual, last } from 'lodash-es';
import { Enemy } from './Enemy';
import { isEnemy } from './helpers/isEnemy';
import { isPartyMember } from './helpers/isPartyMember';
import { PartyMember } from './PartyMember';
import { PathFindingGrid } from './PathFindingGrid';
import { TurnQueue } from './TurnQueue';
import { Unit } from "./Unit";

function closest<T extends Phaser.Types.Math.Vector2Like>(worldX: number, worldY: number, points: T[]): T {
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
  return list.some(item => isEqual(item, needle))
}

export class Battle {
  private turnQueue: TurnQueue
  public partyMembers: PartyMember[]
  public enemies: Enemy[]

  constructor(private scene: Phaser.Scene, private grid: PathFindingGrid, public units: Unit[]) {
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

    if (!stats.attacks && !stats.moves) {
      this.endTurn()
      return
    }

    const target = closest(current.x, current.y, this.partyMembers)

    const { x: tileX, y: tileY } = this.grid.worldToTileXY(current.x, current.y)
    const { x: targetX, y: targetY } = this.grid.worldToTileXY(target.x, target.y)

    this.grid.setWalkableAt(targetX, targetY, true)

    const isAtRange = includes(this.grid.checkAdjacent(tileX, tileY, stats.range + 1), [targetX, targetY])

    if (isAtRange) {
      if (!stats.attacks) return this.endTurn()

      this.attack(target)
    } else {
      if (!stats.moves) return this.endTurn()

      const path = this.grid.findPath(tileX, tileY, targetX, targetY)

      // Make sure that the last point is not occupied by the target,
      // if it is, remove it
      if (isEqual(last(path), [targetX, targetY])) {
        path.pop()
      }

      const [endX, endY] = path.slice(0, stats.moves + 1).pop()!

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
  }

  public async start() {
    this.attachListeners()
    this.turn()
  }


  private async onBegin() {
    const { current } = this.turnQueue
    const { stats } = current

    // Reset stats
    stats.moves = stats.maxMoves
    stats.attacks = stats.maxAttacks
  }


  private async onMove() {
    if (this.endIf()) this.endTurn()
  }


  //
  // Moves
  //

  /** Move an unit to tile XY coordinates */
  private async moveTo(tileX: number, tileY: number) {
    const { current } = this.turnQueue
    const { stats } = current
    const { x: startX, y: startY } = this.grid.worldToTileXY(current.x, current.y)
    const isValid = includes(this.grid.checkAdjacent(startX, startY, stats.moves + 1), [tileX, tileY])

    if (isValid) {
      const { length } = await current.moveTo(tileX, tileY, this.grid)
      stats.moves -= length - 1
    } else {
      console.log('INVALID_MOVE :>>', 'moveTo', { startX, startY, tileX, tileY })
    }

    this.onMove()
  }

  private attack(target: Unit) {
    const { current } = this.turnQueue
    const { stats } = current

    // TODO: Validate attack

    target.hit(stats.strength)
    --stats.attacks

    this.onMove()
  }

  private attachListeners() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const { current } = this.turnQueue
      const isPartyMemberTurn = isPartyMember(current)

      if (isPartyMemberTurn) {
        const { worldX, worldY } = pointer
        const { x: tileX, y: tileY } = this.grid.worldToTileXY(worldX, worldY)
        this.moveTo(tileX, tileY)
      }
    })
  }
}



  // private draw(): void {
  //   const { current } = this.turnQueue

  //   if (isPartyMember(current)) {
  //     const { stats } = current
  //     const { x: tileX, y: tileY } = this.grid.worldToTileXY(current.x, current.y)

  //     const group = this.moves
  //     group.clear(true)

  //     const tiles = this.grid.checkAdjacent(tileX, tileY, stats.moves + 1)

  //     tiles.forEach(([x, y]) => {
  //       const { x: worldX, y: worldY } = this.grid.tileToWorldXY(x, y)
  //       const rect = this.scene.add.rectangle(worldX, worldY, 9, 9, 0xffffff)
  //       group.add(rect)
  //     })
  //   }
  // }
