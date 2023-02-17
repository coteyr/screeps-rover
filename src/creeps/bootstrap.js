/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  run() {
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

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 && this.creep.memory.task) {
      return this.creep.memory.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      this.target = this.creep.room.controller
      return 'upgrade'
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      this.task = 'mine'
      return 'mine'
    } else {
      this.task = 'mine'
      return 'mine'
    }
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

}

module.exports.bootstrap = Bootstrap
