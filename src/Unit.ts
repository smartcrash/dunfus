import { range } from 'lodash-es'
import { Grid } from 'pathfinding'
import { HealthBar } from './HealthBar'
import { Helpers } from './Helpers'
import { Stats, StatsManager } from './StatsManager'

const { max } = Math

export class Unit extends Phaser.Physics.Arcade.Sprite {
  private healthBar!: HealthBar
  public stats: StatsManager

  constructor({
    scene,
    x,
    y,
    texture,
    stats,
  }: {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    stats: Stats
  }) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setFriction(0)
    this.setBounce(0)

    this.body.setSize(18, 12)
    this.body.setOffset(0, 4)

    // TODO: Create `setPos` method
    this.x -= this.body.offset.x
    this.y -= this.body.offset.y

    this.stats = new StatsManager(stats)

    this.setDepth(2)

    this.attachHealthBar()
  }

  private attachHealthBar(): void {
    this.healthBar = new HealthBar(this.scene, this.x, this.y, 15, 5, {
      defaultValue: this.stats.hp,
      maxValue: this.stats.maxHp,
    })

    // Follow unit's movement
    const onUpdate = () => this.healthBar.setX(this.x - this.width / 2 + 2).setY(this.y - this.height + 3)

    // Sync value with unit's HP
    this.stats.on('CHANGE', (key: string, value: number) => { if (key === 'hp') this.healthBar.setValue(value) })

    // Show on hover
    this.healthBar.setAlpha(0)

    const onPointerMove = (pointer: Phaser.Input.Pointer) => {
      const { worldX, worldY } = pointer
      if (this.getBounds().contains(worldX, worldY)) this.healthBar.setAlpha(1)
      else this.healthBar.setAlpha(0)
    }

    // Attach listeners
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, onUpdate)
    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    // Clean up events
    this.once(Phaser.GameObjects.Events.REMOVED_FROM_SCENE, () => {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate)
      this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    })
  }

  public createAnims(
    anims: {
      key: string
      config: Phaser.Types.Animations.GenerateFrameNumbers
      repeat?: number
    }[],
    frameRate = 8
  ): void {
    const createAnim = this.scene.anims.create.bind(this.scene.anims)
    const generateFrameNumbers = this.scene.anims.generateFrameNumbers.bind(this.scene.anims)
    const textureKey = this.texture.key

    anims.forEach(({ key, repeat, config }) =>
      createAnim({
        key,
        frames: generateFrameNumbers(textureKey, config),
        frameRate,
        repeat,
      })
    )
  }

  /**
   * Start playing given animation
   */
  public playAnim(key: string, ignoreIfPlaying?: boolean): void {
    const textureKey = this.texture.key
    this.play(`${textureKey}.${key}`, ignoreIfPlaying)
  }

  /**
   * Reduce HP and play hit animation
   *
   * TODO: Maybe remove
   */
  public hit(damage: number): void {
    this.stats.decrease('hp', damage)

    if (!this.stats.hp) return this.destroy()

    const textureKey = this.texture.key

    this.play(`${textureKey}.hit`)
    this.playAfterDelay(`${textureKey}.idle`, this.anims.duration)
  }

  /** Destroy this Unit removing it from scene  */
  public destroy() {
    const textureKey = this.texture.key

    this.play(`${textureKey}.die`)
    setTimeout(() => {
      super.destroy()
      this.healthBar.destroy()
    }, this.anims.duration)
  }

  get tileX() { return Helpers.worldToTileX(this.x) }

  get tileY() { return Helpers.worldToTileY(this.y) }

  /** Returns a list of tile XY coordinates that this unit can move to */
  public getMovableTiles(grid: Grid): [number, number][] {
    const { tileX, tileY } = this
    const center = new Phaser.Math.Vector2(tileX, tileY)
    const distance = this.stats.moves

    const rows = range(max(1, tileX - distance), tileX + distance + 1)
    const columns = range(max(1, tileY - distance), tileY + distance + 1)

    const positions: [number, number][] = []

    rows.forEach((x) =>
      columns.forEach((y) => {
        if (x === tileX && tileY === y) return
        if (!grid.isWalkableAt(x, y)) return
        if (center.distance({ x, y }) > distance) return
        if (Helpers.findPath(tileX, tileY, x, y, grid).length - 1 > distance) return
        positions.push([x, y])
      })
    )

    return positions
  }

  /** Returns a list of tile XY coordinates that this unit can attack to */
  public getAttackableTiles(grid: Grid): [number, number][] {
    const { tileX, tileY } = this
    const center = new Phaser.Math.Vector2(tileX, tileY)
    const distance = this.stats.range

    const rows = range(max(1, tileX - distance), tileX + distance + 1)
    const columns = range(max(1, tileY - distance), tileY + distance + 1)

    const positions: [number, number][] = []

    rows.forEach((x) =>
      columns.forEach((y) => {
        if (x === tileX && tileY === y) return
        // if (!grid.isWalkableAt(x, y)) return
        if (center.distance({ x, y }) > distance) return
        if (Helpers.findPath(tileX, tileY, x, y, grid).length - 1 > distance) return
        positions.push([x, y])
      })
    )

    return positions
  }

  /**
   * Receive an tile XY coordinates along with a grid, find a path
   * and move along path.
   * Resolves when the unit reaches the destination.
   */
  public async moveTo(tileX: number, tileY: number, grid: Grid): Promise<number[][]> {
    return new Promise((resolve) => {
      const { x: startX, y: startY } = Helpers.worldToTileXY(this.x, this.y)

      const path = Helpers.findPath(startX, startY, tileX, tileY, grid)
      const interval = 300

      if (path.length <= 1) return resolve(path)

      grid.setWalkableAt(startX, startY, true)
      grid.setWalkableAt(tileX, tileY, false)

      this.playAnim(`walk`)

      path.slice(1).forEach(([x, y], index, { length }) => {
        setTimeout(() => {
          const worldX = Helpers.tileToWorldX(x) - this.body.offset.x
          const worldY = Helpers.tileToWorldY(y) - this.body.offset.y

          this.scene.physics.moveTo(this, worldX, worldY, undefined, interval)

          const { velocity } = this.body

          this.setFlipX(velocity.x < 0)

          if (index === length - 1) {
            setTimeout(() => {
              this.body.stop()
              this.playAnim(`idle`)
              resolve(path)
            }, interval)
          }
        }, index * interval)
      })
    })
  }
}
