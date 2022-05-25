import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

enum EVENTS {
  TURN_START = 'turnstart',
  TURN_END = 'turnend'
}

export { eventsCenter, EVENTS }
