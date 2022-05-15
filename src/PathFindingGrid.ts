import Easystar from 'easystarjs';

const array2d = <T>(rows: number, cols: number, defaultValue: T): T[][] => Array.from(Array(rows), () => new Array(cols).fill(defaultValue));

export class PathFindingGrid {
  private easystar: Easystar.js
  private tilemap: Phaser.Tilemaps.Tilemap

  constructor(tilemap: Phaser.Tilemaps.Tilemap) {
    this.easystar = new Easystar.js()
    this.tilemap = tilemap

    const grid: number[][] = array2d(tilemap.height, tilemap.width, -1)
    const acceptableTiles: number[] = []

    tilemap.forEachTile(({ properties, index, x, y }) => {
      grid[x][y] = index
      if (!properties.collides && !acceptableTiles.includes(index)) acceptableTiles.push(index)
    })

    this.easystar.setGrid(grid)
    this.easystar.setAcceptableTiles(acceptableTiles)

    this.easystar.findPath
  }

  /**
   * Find a path.
   */
  findPath(startX: number, startY: number, endX: number, endY: number, callback: (path: { x: number, y: number }[] | null) => void): void {
    this.easystar.findPath(startX, startY, endX, endY, callback)
    this.easystar.calculate()
  }

  /**
   * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
   * layers position, scale and scroll. This will return a new Vector2
   */
  worldToTileXY(worldX: number, worldY: number): Phaser.Math.Vector2 {
    return this.tilemap.worldToTileXY(worldX, worldY)
  }

  /**
   * Converts from tile X coordinates (tile units) to world X coordinates (pixels)
   */
  tileToWorldX(tileX: number): number {
    return this.tilemap.tileToWorldX(tileX) + this.tilemap.tileWidth / 2
  }

  /**
   * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels)
   */
  tileToWorldY(tileY: number): number {
    return this.tilemap.tileToWorldY(tileY) + this.tilemap.tileHeight / 2
  }
}
