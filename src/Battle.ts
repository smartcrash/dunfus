import { Client as BoardGame } from 'boardgame.io/client';
import { Unit } from './Unit';

export class Battle {
  private game: ReturnType<typeof BoardGame>

  constructor({ units }: { units: Unit[] }) {
    this.game = BoardGame({
      game: {
        setup: () => ({}),

      }
    })
  }

  start(): void { this.game.start() }
}
