class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    let creep = this.creep
    let source = _.first(creep.room.find(FIND_SOURCES))

    if(creep.store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
      if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    } else {
      if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  }
}

module.exports.bootstrap = Bootstrap
