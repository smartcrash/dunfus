import { applyMixins } from './applyMixins'
import { HasStats } from './mixins/HasStats'
import { PathFindingGrid } from './PathFindingGrid'

export interface Unit extends Phaser.Physics.Arcade.Sprite, HasStats { }

export class Unit extends Phaser.Physics.Arcade.Sprite {
  constructor({
    scene,
    x,
    y,
    texture,
  }: {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
  }) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setFriction(0)
    this.setBounce(0)

    this.body.setSize(18, 12)
    this.body.setOffset(0, 8)

    // TODO: Create `setPos` method
    this.x -= this.body.offset.x
    this.y -= this.body.offset.y

    this.setDepth(9)
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

  public hit(damage: number): void {
    this.stats.hp -= damage

    const textureKey = this.texture.key

    this.play(`${textureKey}.hit`)
    this.playAfterDelay(`${textureKey}.idle`, this.anims.duration)
  }

  /**
   * Receive an tile XY coordinates along with a grid, find a path
   * and move along path.
   * Resolves when the unit reaches the destination.
   */
  public async moveTo(
    tileX: number,
    tileY: number,
    grid: PathFindingGrid,
  ): Promise<number[][]> {
    return new Promise((resolve) => {
      const { x: startX, y: startY } = grid.worldToTileXY(this.x, this.y)

      const path = grid.findPath(startX, startY, tileX, tileY)
      const interval = 300

      if (path.length <= 1) return resolve(path)

      grid.setWalkableAt(startX, startY, true)
      grid.setWalkableAt(tileX, tileY, false)

      this.playAnim(`walk`)

      path.slice(1).forEach(([x, y], index, { length }) => {
        setTimeout(() => {
          const worldX = grid.tileToWorldX(x) - this.body.offset.x
          const worldY = grid.tileToWorldY(y) - this.body.offset.y

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

applyMixins(Unit, [HasStats])
