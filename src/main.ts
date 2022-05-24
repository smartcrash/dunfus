import './style.css'
import Phaser, { Game } from 'phaser'
import { Room } from './scenes/Room'
import { Preload } from './scenes/Preload'
import { UI } from './scenes/UI'

new Game({
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 256,
    height: 192,
    zoom: 4,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [Preload, Room, UI],
})
