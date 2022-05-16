import { applyMixins } from "./applyMixins"
import { HasStats, IStats } from "./mixins/HasStats"

type AnimConfig = {
  key: string,
  config: Phaser.Types.Animations.GenerateFrameNumbers
}

export interface Unit extends Phaser.Physics.Arcade.Sprite, HasStats { }

export class Unit extends Phaser.Physics.Arcade.Sprite {
  constructor(
    { scene, x, y, texture, initalAnim, anims, frameRate = 8, stats }:
      {
        scene: Phaser.Scene,
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

    this.hp = stats.hp
    this.maxHp = stats.maxHp
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
}

applyMixins(Unit, [HasStats])
