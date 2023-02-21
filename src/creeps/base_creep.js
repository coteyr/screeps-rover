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

  get empty() {
    return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
  }

  get full() {
    return this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0
  }

  get has_task() {
    return this.creep.memory.task ? true : false
  }

  get task() {
    return this.creep.memory.task
  }

  get controller() {
    return this.creep.room.controller
  }

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

  choose_storage() {
    let structures = this.creep.room.find(FIND_MY_STRUCTURES)
    structures = _.filter(structures, s => { return ((s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) )})
    console.log(structures.length)
    let tar = this.creep.pos.findClosestByRange(structures)

    console.log(tar.structureType)
    return tar
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

  choose_construction_site() {
    return Math.most_targeting(this.creep.room.find(FIND_MY_CONSTRUCTION_SITES), Game.creeps)
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
