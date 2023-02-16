class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    let creep = this.creep

    if(creep.task === 'mine') {
      if(creep.harvest(creep.target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.target)
      }
    } else {
      if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  }

  get target() {
    return _.first(this.creep.room.find(FIND_SOURCES))
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.memory['task']) {
      return this.memory['task']
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.creep.task = 'upgrade'
      return 'upgrade'
    } else {
      this.creep.task = 'mine'
      return 'mine'
    }
  }

  set task(value) {
    this.memory['task'] = value
  }

  get memory() {
    return this.creep.memory
  }
}

module.exports.bootstrap = Bootstrap
