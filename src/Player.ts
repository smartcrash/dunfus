import { type PathFindingGrid } from "./PathFindingGrid"
import { Unit } from "./Unit"


export class Player extends Unit {
  private speed = 80
  private cursorsEnabled = true

  constructor(scene: Phaser.Scene, x: number, y: number, private grid: PathFindingGrid) {
    super({
      scene,
      x,
      y,
      texture: 'hero',
      initalAnim: 'hero.idle',
      anims: [
        { key: 'hero.idle', config: { start: 0, end: 3 } },
        { key: 'hero.walk', config: { start: 8, end: 13 } },
        { key: 'hero.attack', config: { start: 16, end: 19 } },
        { key: 'hero.hit', config: { start: 24, end: 26 } },
        { key: 'hero.die', config: { start: 32, end: 39 } },
      ],
    })

    this.addCursorKeysListener()
    this.addClickListener()
  }

  private addCursorKeysListener() {
    const cursors = this.scene.input.keyboard.createCursorKeys()
    const speed = this.speed

    // Update body velocity based on pressed cursors
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      if (!this.cursorsEnabled) return

      this.setVelocity(0, 0)

      if (cursors.left.isDown) this.setVelocityX(-speed)
      else if (cursors.right.isDown) this.setVelocityX(speed)
      else if (cursors.up.isDown) this.setVelocityY(-speed)
      else if (cursors.down.isDown) this.setVelocityY(speed)
    })

    // Play animation based on body velocity
    // TODO: Move to Unit class

    const playAnim = (key: string) => this.play(key, true)
    const velocity = this.body.velocity
    let direccion: 'up' | 'down' | 'right' | 'left' = 'down'

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      if (velocity.x < 0) direccion = 'left'
      else if (velocity.x > 0) direccion = 'right'
      else if (velocity.y > 0) direccion = 'down'
      else if (velocity.y < 0) direccion = 'up'

      this.setFlipX(direccion === 'left')

      if (velocity.length()) playAnim('hero.walk')
      else playAnim('hero.idle')
    })
  }

  private addClickListener() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const { worldX, worldY } = pointer
      const { x: endX, y: endY } = this.grid.worldToTileXY(worldX, worldY)
      const { x: startX, y: startY } = this.grid.worldToTileXY(this.x, this.y)

      const path = this.grid.findPath(startX, startY, endX, endY)
      const interval = 300

      this.cursorsEnabled = false

      path.slice(1).forEach(([x, y], index, { length }) => {
        setTimeout(() => {
          const worldX = this.grid.tileToWorldX(x) - this.body.offset.x
          const worldY = this.grid.tileToWorldY(y) - this.body.offset.y

          this.scene.physics.moveTo(this, worldX, worldY, undefined, interval)

          if (index === length - 1) setTimeout(() => {
            this.body.stop()
            this.cursorsEnabled = true
          }, interval)
        }, index * interval)
      })
    })
  }
}
