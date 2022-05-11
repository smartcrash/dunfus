import './style.css'
import Phaser, { Game } from 'phaser'
import { World } from './scenes/World'

new Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  render: { pixelArt: true },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [World],
})
