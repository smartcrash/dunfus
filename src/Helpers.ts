import { AStarFinder, Grid } from 'pathfinding'
import Constants from "./Constants"

const { floor } = Math

/**
 * Converts from world X coordinates (pixels) to tile X coordinates (tile units)
 */
const worldToTileX = (worldX: number): number => floor(worldX / Constants.tileWidth)

/**
 * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units)
 */
const worldToTileY = (worldY: number): number => floor(worldY / Constants.tileHeight)

/**
 * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
 * layers position, scale and scroll. This will return a new Vector2
 */
const worldToTileXY = (worldX: number, worldY: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(worldToTileX(worldX), worldToTileY(worldY))

/**
 * Converts from tile X coordinates (tile units) to world X coordinates (pixels)
 */
const tileToWorldX = (tileX: number): number => tileX * Constants.tileWidth + Constants.tileWidth / 2

/**
 * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels)
 */

const tileToWorldY = (tileY: number): number => tileY * Constants.tileHeight + Constants.tileHeight / 2

/**
 * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels)
 */
const tileToWorldXY = (tileX: number, tileY: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(tileToWorldX(tileX), tileToWorldY(tileY))


/**
 * Find a path.
 */
const finder = new AStarFinder({
  allowDiagonal: false,
  dontCrossCorners: true
} as any)

const findPath = (startX: number, startY: number, endX: number, endY: number, grid: Grid): [number, number][] => finder.findPath(startX, startY, endX, endY, grid.clone()) as [number, number][]

export const Helpers = {
  worldToTileX,
  worldToTileY,
  worldToTileXY,
  tileToWorldX,
  tileToWorldY,
  tileToWorldXY,
  findPath,
} as const
