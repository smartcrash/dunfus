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

    // Play animation based on body velocity

    const playAnim = (key: string) => this.play(key, true)
    const velocity = this.body.velocity
    const textureKey = this.texture.key
    let direccion: 'up' | 'down' | 'right' | 'left' = 'down'

    const handleUpdate = () => {
      if (velocity.x < 0) direccion = 'left'
      else if (velocity.x > 0) direccion = 'right'
      else if (velocity.y > 0) direccion = 'down'
      else if (velocity.y < 0) direccion = 'up'

      this.setFlipX(direccion === 'left')

      if (velocity.length()) playAnim(`${textureKey}.walk`)
      else playAnim(`${textureKey}.idle`)
    }

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, handleUpdate)
    this.scene.events.once(Phaser.Scenes.Events.DESTROY, () =>
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, handleUpdate)
    )
  }

  public createAnims(
    anims: {
      key: string
      config: Phaser.Types.Animations.GenerateFrameNumbers
    }[],
    frameRate = 8
  ): void {
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

      path.slice(1).forEach(([x, y], index, { length }) => {
        setTimeout(() => {
          const worldX = grid.tileToWorldX(x) - this.body.offset.x
          const worldY = grid.tileToWorldY(y) - this.body.offset.y

          this.scene.physics.moveTo(this, worldX, worldY, undefined, interval)

          if (index === length - 1) {
            setTimeout(() => {
              this.body.stop()
              resolve(path)
            }, interval)
          }
        }, index * interval)
      })

    })
  }
}

applyMixins(Unit, [HasStats])
