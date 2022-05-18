import { Unit } from "./Unit"

export class Player extends Unit {
  private speed = 80
  private cursorsEnabled = true

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super({
      scene,
      x,
      y,
      texture: 'hero',
    })

    this.createAnims([
      { key: 'hero.idle', config: { start: 0, end: 3 } },
      { key: 'hero.walk', config: { start: 8, end: 13 } },
      { key: 'hero.attack', config: { start: 16, end: 19 } },
      { key: 'hero.hit', config: { start: 24, end: 26 } },
      { key: 'hero.die', config: { start: 32, end: 39 } },
    ])

    this.setStats({
      hp: 5,
      maxHp: 5
    })

    this.addClickListener()
  }

  /**
   * Attach necesary cursor keys event listeners to allow
   * arrow keys movement.
   */
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
  }

  private addClickListener() {
    // this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
    //   const { worldX, worldY } = pointer
    //   const { x: tileX, y: tileY } = this.grid.worldToTileXY(worldX, worldY)

    //   this.cursorsEnabled = false
    //   this.moveTo(tileX, tileY, () => this.cursorsEnabled = true)
    // })
  }
}
