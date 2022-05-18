import { times } from 'lodash-es'

const SPACING = 10

export class HealthBar {
  private maxValue: number
  private hearths: Phaser.GameObjects.Rectangle[]

  constructor(
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    { defaultValue, maxValue }: { defaultValue: number; maxValue: number }
  ) {
    this.maxValue = maxValue

    this.scene.add
      .rectangle(this.x + this.width / 2, this.y, this.width, this.height, 0x000000)
      .setStrokeStyle(SPACING / 2, 0xffffff)

    const cellWidth = (this.width - SPACING * 2 - SPACING * (this.maxValue - 1)) / this.maxValue
    const cellHeight = this.height - SPACING * 2

    this.hearths = times(maxValue, (index) => {
      const rectX = this.x + cellWidth / 2 + SPACING + (SPACING + cellWidth) * index
      const rectY = this.y

      return this.scene.add.rectangle(rectX, rectY, cellWidth, cellHeight, 0xffffff)
    })

    this.setValue(defaultValue)
  }

  setValue(value: number): void {
    this.hearths.forEach((rect, index) => {
      if (index < value) rect.setAlpha(1)
      else rect.setAlpha(0)
    })
  }
}
