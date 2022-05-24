import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

enum EVENTS {}

export { eventsCenter, EVENTS }
