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
    if(!this.target) {
      this.target = this.choose_source()
    }
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.memory.task) {
      return this.creep.memory.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      this.target = this.creep.room.controller
      return 'upgrade'
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      this.task = 'mine'
      this.target = this.choose_source()
      return 'mine'
    } else {
      this.task = 'mine'
      this.target = this.choose_source()
      return 'mine'
    }
  }

  set task(value) {
    this.creep.memory.task = value
  }

  get memory() {
    return this.creep.memory
  }

  get target() {
    let id = this.creep.memory.target
    return Game.getObjectById(id)
  }

  set target(value) {
    this.creep.memory.target = value.id
  }

  choose_source() {
    let least = 1000
    let result = null
    _.each(this.creep.room.find(FIND_SOURCES), s => {
      let count = _.filter(Game.creeps, c => {return c.my  && c.memory.target.id === s.id}).length
      if (count <= least){
        least = count
        result = s
      }
    })
    return result
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
