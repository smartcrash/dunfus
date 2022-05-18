import { range } from 'lodash-es'
import { AStarFinder, Grid } from 'pathfinding'

const { max } = Math

export class PathFindingGrid {
  private grid: Grid
  private finder: AStarFinder
  private tilemap: Phaser.Tilemaps.Tilemap

  constructor(tilemap: Phaser.Tilemaps.Tilemap) {
    this.tilemap = tilemap
    this.grid = new Grid(tilemap.width, tilemap.height)
    this.finder = new AStarFinder({ allowDiagonal: false, dontCrossCorners: true } as any)

    tilemap.forEachTile(({ properties, x, y }) =>
      this.grid.setWalkableAt(x, y, !properties.collides)
    )
  }

  /**
   * Find a path.
   */
  findPath(startX: number, startY: number, endX: number, endY: number): number[][] {
    return this.finder.findPath(startX, startY, endX, endY, this.grid.clone())
  }

  /**
   * Converts from world X coordinates (pixels) to tile X coordinates (tile units)
   */
  worldToTileX(worldX: number): number {
    return this.tilemap.worldToTileX(worldX)
  }

  /**
   * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units)
   */
  worldToTileY(worldY: number): number {
    return this.tilemap.worldToTileY(worldY)
  }

  /**
   * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
   * layers position, scale and scroll. This will return a new Vector2
   */
  worldToTileXY(worldX: number, worldY: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.worldToTileX(worldX), this.worldToTileY(worldY))
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

  /**
   * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels)
   */
  tileToWorldXY(tileX: number, tileY: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.tileToWorldX(tileX), this.tileToWorldY(tileY))
  }

  /**
   * Check if tile XY coordinate is walkable
   */
  isWalkableAt(tileX: number, tileY: number): boolean {
    return this.grid.isWalkableAt(tileX, tileY)
  }

  /**
   * Returns an array of adjasent reachable tiles from tile XY coordinates
   */
  checkAdjacent(tileX: number, tileY: number, distance: number): number[][] {
    const center = new Phaser.Math.Vector2(tileX, tileY)

    const rows = range(max(1, tileX - distance), tileX + distance + 1)
    const columns = range(max(1, tileY - distance), tileY + distance + 1)

    const positions: number[][] = []

    rows.forEach((x) =>
      columns.forEach((y) => {
        if (x === tileX && tileY === y) return
        if (!this.grid.isWalkableAt(x, y)) return
        if (center.distance({ x, y }) > distance) return
        if (this.findPath(tileX, tileY, x, y).length > distance) return
        positions.push([x, y])
      })
    )

    return positions
  }
}
