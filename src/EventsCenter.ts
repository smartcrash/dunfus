import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

enum EVENTS {
  TURN_START = 'turnstart',
  TURN_END = 'turnend',
  MOVE_START = 'movestart',
  MOVE_END = 'moveend'
}

export { eventsCenter, EVENTS }
