
class BaseCreep {
  constructor(creep) {
    this.creep = creep
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
}

module.exports.creeps_base = BaseCreep
