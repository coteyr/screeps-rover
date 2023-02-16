class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    let creep = this.creep

    if(creep.store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
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
}

module.exports.bootstrap = Bootstrap
