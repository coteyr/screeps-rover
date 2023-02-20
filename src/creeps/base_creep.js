
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

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

  harvest() {
    if(this.creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
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
