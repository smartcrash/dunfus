import './style.css'
import Phaser, { Game } from 'phaser'
import { World } from './scenes/World'

new Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  render: { pixelArt: true },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [World],
})
