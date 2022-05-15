import { AStarFinder, Grid } from 'pathfinding';

export class PathFindingGrid {
  private grid: Grid
  private finder: AStarFinder
  private tilemap: Phaser.Tilemaps.Tilemap

  constructor(tilemap: Phaser.Tilemaps.Tilemap) {
    this.tilemap = tilemap
    this.grid = new Grid(tilemap.width, tilemap.height)
    this.finder = new AStarFinder({
      allowDiagonal: false,
      dontCrossCorners: true
    } as any)


    tilemap.forEachTile(({ properties, x, y }) => this.grid.setWalkableAt(x, y, !properties.collides))
  }

  /**
   * Find a path.
   */
  findPath(startX: number, startY: number, endX: number, endY: number): number[][] {
    return this.finder.findPath(startX, startY, endX, endY, this.grid.clone())
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

  /**
   * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels)
   */
  tileToWorldXY(tileX: number, tileY: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      this.tileToWorldX(tileX),
      this.tileToWorldY(tileY)
    )
  }
}
