import { Enemy } from './Enemy'

export class Slime extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super({
      scene,
      x,
      y,
      texture: 'slime',
      stats: {
        hp: 3,
        maxHp: 3,
        moves: 2,
        maxMoves: 2,
        speed: 2,
        strength: 1,
        range: 1,
        attacks: 1,
        maxAttacks: 1,
      }
    })

    this.createAnims([
      { key: 'slime.idle', repeat: -1, config: { start: 0, end: 4 } },
      { key: 'slime.walk', repeat: -1, config: { start: 0, end: 4 } },
      { key: 'slime.attack', config: { start: 0, end: 4 } },
      { key: 'slime.hit', config: { start: 6, end: 8 } },
      { key: 'slime.die', config: { start: 12, end: 17 } },
    ])

    this.playAnim('idle')
  }
}
