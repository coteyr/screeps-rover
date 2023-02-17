/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 && this.creep.memory.task) {
      return null
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      this.target = this.creep.room.controller
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      this.task = 'mine'
    } else {
      this.task = 'mine'
    }
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    } else {
      this.target = this.creep.room.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
