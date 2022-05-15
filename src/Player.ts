import { type PathFindingGrid } from "./PathFindingGrid"

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 80

  constructor(scene: Phaser.Scene, x: number, y: number, private grid: PathFindingGrid) {
    super(scene, x, y, 'hero')

    this.createAnims()
    this.play('idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.addCursorKeysListener()
    this.addClickListener()
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
    const speed = this.speed

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

  private addClickListener() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const { worldX, worldY } = pointer
      const { x: endX, y: endY } = this.grid.worldToTileXY(worldX, worldY)
      const { x: startX, y: startY } = this.grid.worldToTileXY(this.x, this.y)

      const handlePath = (path: { x: number, y: number }[] | null): void => {
        if (path === null) return

        const tweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];

        path.forEach(({ x, y }) => {
          tweens.push({
            targets: this,
            props: {
              x: { value: this.grid.tileToWorldX(x), duration: 200 },
              y: { value: this.grid.tileToWorldY(y), duration: 200 }
            }
          });

        })

        this.scene.tweens.timeline({ tweens });
      }

      this.grid.findPath(startX, startY, endX, endY, handlePath)
    })

  }
}
