/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if(this.creep.room.energyAvailable >= 300 && this.task === 'store') {
      this.task = null
    }
    if (!this.empty && !this.full && this.has_task) {
      return null
    } else if (this.full) {
      if(this.creep.room.energyAvailable < 300) {
        this.task = 'store'
        this.target = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS)
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
      if(!this.target) {
        this.target = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS)
      }
      this.transfer()
    } else {
      this.target = this.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
