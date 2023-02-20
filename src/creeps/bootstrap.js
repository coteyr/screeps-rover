/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (!this.empty && !this.full && this.has_task) {
      return null
    } else if (this.full) {
      this.task = 'upgrade'
      this.target = this.controller
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
    } else {
      this.target = this.room.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
