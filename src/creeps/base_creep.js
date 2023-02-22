/**
 * The Base Creep that all other creeps are based on
 * these methods should be useful my most/all creeps and should
 * help prevent having to have `this.creep` in the child classes
 * @constructor
 * @param {creep} creep - The creep wrapped by the BaseCreep object
 */
class BaseCreep {
  constructor(creep) {
    this.creep = creep
  }

  /**
   * Is the current creep's carry parts empty
   * @return {boolean} - true if the creeps has 0 energy, false otherwise.
   */
  get empty() {
    return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
  }

  /**
   * Is the current creep full of energy
   * @return {boolean} - true if the creep has no more room for energy, false otherwise
   */
  get full() {
    return this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0
  }

  /**
   * Does the current creep have any task at all
   * @return {boolean} - true if the creep has any task at all
   */
  get has_task() {
    return this.creep.memory.task ? true : false
  }

  /**
   * The task the current creep is trying to do
   * @return {string} - the task name the creep is trying to carry out
   */
  get task() {
    return this.creep.memory.task
  }

  /**
   * Get the controller for the room the creep is currently in
   * @return {StructureController} - The controller that is in the room the creep is in
   */
  get controller() {
    return this.creep.room.controller
  }

  /**
   * Set the task the creep should try to do
   * @param {string} value - The task that should be set
   */
  set task(value) {
    if(this.creep.memory.task !== value) {
      this.creep.memory.task = value
      this.target = null
    }
  }


  get memory() {
    return this.creep.memory
  }

  get target() {
    let id = this.creep.memory.target
    return Game.getObjectById(id)
  }

  set target(value) {
    if(value === null) {
      this.creep.memory.target = null
    } else {
      this.creep.memory.target = value.id
    }
  }

  get has_static_miners() {
    return this.creep.room.energyCapacityAvailable > 550 //maybe check for miners?
  }

  choose_storage() {
    let structures = this.creep.room.find(FIND_MY_STRUCTURES)
    structures = _.filter(structures, s => { return ((s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) &&  s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 )})
    let tar = this.creep.pos.findClosestByRange(structures)
    return tar
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

  choose_energy() {
    return Math.fewest_targeting(this.creep.room.find(FIND_DROPPED_RESOURCES), Game.creeps)
  }

  choose_construction_site() {
    return Math.most_targeting(this.creep.room.find(FIND_MY_CONSTRUCTION_SITES), Game.creeps)
  }

  choose_recipiant() {
    let targets = this.creep.room.find(FIND_MY_CREEPS)//, {filter: c => {c.store.getFreeCapacity(RESOURCE_ENERGY) > 49}})
    targets = _.filter(targets, t => { return t.store.getFreeCapacity(RESOURCE_ENERGY) > 49})
    console.log(targets.length)
    return Math.fewest_targeting(targets, Game.creeps)
  }

  pickup() {
    if(this.creep.pickup(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  harvest() {
    if(this.creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  build() {
    if(this.creep.build(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  transfer() {
    if(this.creep.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  moveTo() {
    this.creep.moveTo(this.target)
  }

  upgradeController() {
    if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.room.controller)
    }
  }
}

module.exports.creeps_base = BaseCreep
