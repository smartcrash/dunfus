import { times } from 'lodash-es'

enum Colors {
  white = 0xffffff,
  black = 0x000000,
}

const defaultStyles = {
  borderWidth: 1,
  padding: 1,
  spacing: 1,
} as const

export class HealthBar {
  public value: number
  public maxValue: number
  public x = 0
  public y = 0

  private background!: Phaser.GameObjects.Rectangle
  private cells!: Phaser.GameObjects.Rectangle[]

  constructor(
    public scene: Phaser.Scene,
    x: number,
    y: number,
    public width: number,
    public height: number,
    { defaultValue, maxValue }: { defaultValue: number; maxValue: number },
    public styles = defaultStyles,
  ) {
    this.maxValue = maxValue
    this.value = defaultValue

    this.render()
    this.setValue(defaultValue)
    this.setX(x)
    this.setY(y)
  }

  private render(): void {
    const { borderWidth, padding, spacing } = this.styles

    // Draw bordered container
    this.background = this.scene.add
      .rectangle(0, 0, this.width, this.height, Colors.black)
      .setStrokeStyle(borderWidth, Colors.white)
      .setDepth(3)

    // Compute the cell dimensions
    const cellWidth =
      (this.width - padding * 2 - borderWidth - spacing * (this.maxValue - 1)) / this.maxValue
    const cellHeight = this.height - borderWidth - padding * 2

    this.cells = times(this.maxValue, () =>
      this.scene.add.rectangle(0, 0, cellWidth, cellHeight, Colors.white).setDepth(3)
    )
  }

  public setValue(value: number): this {
    this.value = value

    this.cells.forEach((rect, index) => {
      if (index < value) rect.setVisible(true)
      else rect.setVisible(false)
    })

    return this
  }

  public setX(x: number): this {
    this.x = x
    this.background.x = this.x + this.width / 2

    const { padding, spacing } = this.styles

    this.cells.forEach((rect, index) => {
      const cellWidth = rect.width
      const stepX = spacing + cellWidth
      const x = this.x + cellWidth / 2 + padding

      rect.x = x + stepX * index
    })

    return this
  }

  public setY(y: number): this {
    this.y = y
    this.background.y = this.y
    this.cells.forEach((rect) => (rect.y = this.y))

    return this
  }

  public setAlpha(value: number): this {
    this.background.setAlpha(value)
    this.cells.forEach(cell => cell.setAlpha(value))

    return this
  }

  public destroy(fromScene?: boolean): void {
    this.background.destroy(fromScene)
    this.cells.forEach(cell => cell.destroy(fromScene))
  }
}
