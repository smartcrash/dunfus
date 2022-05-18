import { applyMixins } from "./applyMixins"
import { Battle } from "./Battle"
import { HasStats, IStats } from "./mixins/HasStats"
import { PathFindingGrid } from "./PathFindingGrid"

type AnimConfig = {
  key: string,
  config: Phaser.Types.Animations.GenerateFrameNumbers
}

export interface Unit extends Phaser.Physics.Arcade.Sprite, HasStats { }

export class Unit extends Phaser.Physics.Arcade.Sprite {
  protected grid: PathFindingGrid

  constructor(
    { scene, x, y, texture, grid, initalAnim, anims, frameRate = 8, stats }:
      {
        scene: Phaser.Scene,
        grid: PathFindingGrid,
        x: number,
        y: number,
        texture: string,
        initalAnim: string,
        anims: AnimConfig[]
        frameRate?: number
        stats: IStats,
      }
  ) {
    super(scene, x, y, texture)


    this.createAnims(anims, frameRate)
    this.play(initalAnim)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setFriction(0);
    this.setBounce(0);

    this.body.setSize(18, 12)
    this.body.setOffset(0, 8)

    this.x -= this.body.offset.x
    this.y -= this.body.offset.y

    this.grid = grid
    this.stats = stats
  }

  private createAnims(anims: AnimConfig[], frameRate?: number): void {
    const createAnim = this.scene.anims.create.bind(this.scene.anims)
    const generateFrameNumbers = this.scene.anims.generateFrameNumbers.bind(this.scene.anims)
    const textureKey = this.texture.key

    anims.forEach(({ key, config }) =>
      createAnim({
        key,
        frames: generateFrameNumbers(textureKey, config),
        frameRate,
        repeat: -1,
      })
    )
  }

  public moveTo(tileX: number, tileY: number, onComplete: () => void = () => null): void {
    const { x: startX, y: startY } = this.grid.worldToTileXY(this.x, this.y)

    const path = this.grid.findPath(startX, startY, tileX, tileY)
    const interval = 300

    if (path.length <= 1) {
      onComplete()
      return
    }

    path.slice(1).forEach(([x, y], index, { length }) => {
      setTimeout(() => {
        const worldX = this.grid.tileToWorldX(x) - this.body.offset.x
        const worldY = this.grid.tileToWorldY(y) - this.body.offset.y

        this.scene.physics.moveTo(this, worldX, worldY, undefined, interval)

        if (index === length - 1) setTimeout(() => {
          this.body.stop()
          onComplete()
        }, interval)
      }, index * interval)
    })
  }
}

applyMixins(Unit, [HasStats])
