export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero')

    this.createAnims()
    this.setScale(3)
    this.play('idle-down')

    scene.add.existing(this)
  }

  private createAnims() {
    const createAnim = this.scene.anims.create.bind(this.scene.anims)
    const generateFrameNumbers = this.scene.anims.generateFrameNumbers.bind(this.scene.anims)

      ;[
        { key: 'idle-down', frames: { frames: [0] }, },
        { key: 'idle-up', frames: { frames: [1] }, },
        { key: 'idle-left', frames: { frames: [2] }, },
        { key: 'idle-right', frames: { frames: [2] }, },
        { key: 'walk-down', frames: { start: 3, end: 6 }, },
        { key: 'walk-left', frames: { start: 7, end: 10 }, },
        { key: 'walk-right', frames: { start: 7, end: 10 }, },
        { key: 'walk-up', frames: { start: 11, end: 14 }, },
      ].forEach(({ key, frames }) =>
        createAnim({
          key,
          frames: generateFrameNumbers('hero', frames),
          frameRate: 8,
          repeat: -1,
        })
      )
  }
}
