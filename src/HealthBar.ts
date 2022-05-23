import { times } from 'lodash-es'

enum Colors {
  white = 0xffffff,
  black = 0x000000
}

const defaultStyles = {
  borderWidth: 1,
  padding: 1,
  spacing: 1,
} as const

export class HealthBar {
  private maxValue: number
  private hearths: Phaser.GameObjects.Rectangle[]

  constructor(
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    { defaultValue, maxValue }: { defaultValue: number; maxValue: number },
    { borderWidth, padding, spacing } = defaultStyles
  ) {
    this.maxValue = maxValue

    //
    // Render
    //
    this.scene.add
      .rectangle(this.x + this.width / 2, this.y, this.width, this.height, Colors.black)
      .setStrokeStyle(borderWidth, Colors.white)

    const cellWidth = (this.width - (padding * 2) - borderWidth - spacing * (this.maxValue - 1)) / this.maxValue
    const cellHeight = this.height - borderWidth - (padding * 2)

    this.hearths = times(maxValue, (index) => {
      const rectX = this.x + cellWidth / 2 + padding + (spacing + cellWidth) * index
      const rectY = this.y

      return this.scene.add.rectangle(rectX, rectY, cellWidth, cellHeight, Colors.white)
    })

    // Set initial value
    this.setValue(defaultValue)
  }

  public setValue(value: number): void {
    this.hearths.forEach((rect, index) => {
      if (index < value) rect.setAlpha(1)
      else rect.setAlpha(0)
    })
  }
}
