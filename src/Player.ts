export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero')

    this.createAnims()
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
    const speed = 100

    // Update body velocity based on pressed cursors
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      this.setVelocity(0, 0)

      if (cursors.left.isDown) this.setVelocityX(-speed)
      else if (cursors.right.isDown) this.setVelocityX(speed)
      else if (cursors.up.isDown) this.setVelocityY(-speed)
      else if (cursors.down.isDown) this.setVelocityY(speed)
    })

    // Play animation based on body velocity

    const playAnim = (key: string) => this.play(key, true)
    const velocity = this.body.velocity
    let direccion: 'up' | 'down' | 'left' = 'down'

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      if (cursors.left.isDown || cursors.right.isDown) direccion = 'left'
      else if (cursors.up.isDown) direccion = 'up'
      else if (cursors.down.isDown) direccion = 'down'

      if (velocity.length()) this.setFlipX(velocity.x > 0)

      if (velocity.x !== 0) playAnim('walk-left')
      else if (velocity.y < 0) playAnim('walk-up')
      else if (velocity.y > 0) playAnim('walk-down')
      else playAnim(`idle-${direccion}`)
    })
  }
}
