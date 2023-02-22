/* global BaseCreep */

class Carrier extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      if(this.creep.room.energyAvailable < this.creep.room.energyCapacityAvailable) {
        this.task = 'store'
        this.target = this.choose_storage()
      } else {
        this.task = 'deliver'
        this.target = this.choose_recipiant()
      }
    } else if (this.empty) {
      this.task = 'collect'
    } else {
      this.task = 'collect'
    }
  }

  run() {
    this.set_task()
    if(this.task === 'collect') {
      if(!this.target) {
        this.target = this.choose_energy()
      }
      this.pickup()
    } else if(this.task === 'store') {
      if(this.target && this.target.store && this.target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        this.target = null
        this.task = null
      }
      if(!this.target) {
        this.target =  this.choose_storage()
      }
      this.transfer()
    } else if (this.task === 'deliver') {
      if(this.target && this.target.store && this.target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        this.target = null
      }
      if(!this.target) {
        this.target =  this.choose_recipiant()
      }
      this.transfer()
    }
  }

}

module.exports.Carrier = Carrier
