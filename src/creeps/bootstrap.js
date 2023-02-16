class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    if(this.task === 'mine') {
      this.harvest()
    } else {
      this.upgradeController()
    }
  }

  get target() {
    return _.first(this.creep.room.find(FIND_SOURCES))
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.memory.task) {
      return this.creep.memory.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      return 'upgrade'
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      this.task = 'mine'
      return 'mine'
    } else {
      this.task = 'mine'
      return 'mine'
    }
  }

  set task(value) {
    this.creep.memory.task = value
  }

  get memory() {
    return this.creep.memory
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

module.exports.bootstrap = Bootstrap
