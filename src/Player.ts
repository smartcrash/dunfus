export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero')

    this.createAnims()
    this.play('idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.addCursorKeysListener()
  }

  private createAnims() {
    const createAnim = this.scene.anims.create.bind(this.scene.anims)
    const generateFrameNumbers = this.scene.anims.generateFrameNumbers.bind(this.scene.anims)

      ;[
        { key: 'idle', frames: { start: 0, end: 3 } },
        { key: 'walk', frames: { start: 8, end: 13 } },
        { key: 'attack', frames: { start: 16, end: 19 } },
        { key: 'hit', frames: { start: 24, end: 26 } },
        { key: 'die', frames: { start: 32, end: 39 } },
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
    let direccion: 'up' | 'down' | 'right' | 'left' = 'down'

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      if (cursors.left.isDown) direccion = 'left'
      else if (cursors.right.isDown) direccion = 'right'
      else if (cursors.up.isDown) direccion = 'up'
      else if (cursors.down.isDown) direccion = 'down'

      this.setFlipX(direccion === 'left')

      if (velocity.length()) playAnim('walk')
      else playAnim('idle')
    })
  }
}
