import { Ctx } from 'boardgame.io'
import { Client as BoardGame } from 'boardgame.io/client';
import { Unit } from './Unit';

export class Battle {
  private game: ReturnType<typeof BoardGame>

  constructor({ units }: { units: Unit[] }) {
    const getCurrentPlayer = (ctx: Ctx) => units[Number(ctx.currentPlayer)]

    this.game = BoardGame({
      game: {
        setup: () => ({}),

        turn: {
          // TODO: Auto end if current player is an enemy
          endIf() { return false },

          onBegin(G, ctx) {
            const unit = getCurrentPlayer(ctx)
          }
        },

        moves: {
          moveTo(G, ctx, tileX: number, tileY: number) {
            // TODO: Validate move
            const unit = getCurrentPlayer(ctx)

            unit.moveTo(tileX, tileY)
          },

          attack(G, ctx, tileX: number, tileY: number) {
            // TODO:
          }
        }
      }
    })
  }

  start(): void { this.game.start() }
}
