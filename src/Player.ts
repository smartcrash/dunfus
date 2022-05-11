export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero')

    this.createAnims()
    this.setScale(3)
    this.play('idle-down')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.addCursorKeysListener()
  }

  private createAnims() {
    const createAnim = this.scene.anims.create.bind(this.scene.anims)
    const generateFrameNumbers = this.scene.anims.generateFrameNumbers.bind(this.scene.anims)

      ;[
        { key: 'idle-down', frames: { frames: [0] }, },
        { key: 'idle-up', frames: { frames: [1] }, },
        { key: 'idle-left', frames: { frames: [2] }, },
        { key: 'walk-down', frames: { start: 3, end: 6 }, },
        { key: 'walk-left', frames: { start: 7, end: 10 }, },
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

  private addCursorKeysListener() {
    const cursors = this.scene.input.keyboard.createCursorKeys()
    const speed = 200

    const setVelocity = this.setVelocity.bind(this)
    const setVelocityX = this.setVelocityX.bind(this)
    const setVelocityY = this.setVelocityY.bind(this)
    const playAnim = (key: string) => this.play(key, true)
    const setFlipX = this.setFlipX.bind(this)
    const velocity = this.body.velocity

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, function () {
      const prevVelocity = velocity.clone()
      setVelocity(0)

      // Velocity

      if (cursors.left.isDown) setVelocityX(-speed)
      else if (cursors.right.isDown) setVelocityX(speed)
      else if (cursors.up.isDown) setVelocityY(-speed)
      else if (cursors.down.isDown) setVelocityY(speed)


      // Animation

      if (cursors.left.isDown || cursors.right.isDown) playAnim('walk-left')
      else if (cursors.up.isDown) playAnim('walk-up')
      else if (cursors.down.isDown) playAnim('walk-down')

      if (velocity.length()) setFlipX(cursors.right.isDown)

      if (!velocity.length() && prevVelocity.length()) {
        if (prevVelocity.x !== 0) playAnim('idle-left')
        else if (prevVelocity.y > 0) playAnim('idle-down')
        else playAnim('idle-up')
      }
    })
  }
}
