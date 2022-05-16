import { Unit } from "./Unit";

export class Slime extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super({
      scene,
      x,
      y,
      texture: 'slime',
      initalAnim: 'slime.idle',
      anims: [
        { key: 'slime.idle', config: { start: 0, end: 4 } },
        { key: 'slime.walk', config: { start: 0, end: 4 } },
        { key: 'slime.attack', config: { start: 0, end: 4 } },
        { key: 'slime.hit', config: { start: 6, end: 8 } },
        { key: 'slime.die', config: { start: 12, end: 17 } },
      ],
      stats: {
        hp: 3,
        maxHp: 3
      }
    })
  }
}
