import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

enum EVENTS {
  onPlayerHealthChange = '1'
}

export { eventsCenter, EVENTS }
