/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if(this.creep.room.energyAvailable >= this.creep.room.energyCapacityAvailable && this.task === 'store') {
      this.task = null
    }
    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      if(this.creep.room.energyAvailable < this.creep.room.energyCapacityAvailable) {
        this.task = 'store'
        this.target = this.creep.pos.findClosestByRange(_.filter(this.creep.room.find(FIND_MY_STRUCTURES, {filter: s => { return (s.structureType === STRUCTURE_SPAWN || s.structureType == STRUCTURE_SPAWN) &&  s.store.getFreeCapacity(RESOURCE_ENERGY)}})))
      } else {
        this.task = 'upgrade'
        this.target = this.controller
      }
    } else if (this.empty) {
      this.task = 'mine'
    } else {
      this.task = 'mine'
    }
  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    } else if(this.task === 'store') {
      if(this.target && this.target.store && this.target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        this.target = null
      }
      if(!this.target) {
        this.target =  this.creep.pos.findClosestByRange(_.filter(this.creep.room.find(FIND_MY_STRUCTURES, {filter: s => { return (s.structureType === STRUCTURE_SPAWN || s.structureType == STRUCTURE_SPAWN) &&  s.store.getFreeCapacity(RESOURCE_ENERGY)}})))
      }
      this.transfer()
    } else {
      this.target = this.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
