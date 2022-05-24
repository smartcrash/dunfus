import { Enemy } from '../Enemy'

/** Check if given object must be killed */
export const isEnemy = (o: object) => o instanceof Enemy
