import './style.css'
import Phaser, { Game } from 'phaser'
import { Room } from './scenes/Room'
import { Preload } from './scenes/Preload'
import { UI } from './scenes/UI'

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
  scene: [Preload, Room, UI],
})
