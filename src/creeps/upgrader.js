/* global BaseCreep */

class Upgrader extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    this.task = 'upgrade'
  }

  run() {
    this.set_task()
    if(this.task === 'upgrade') {
      if(!this.target) {
        this.target = this.controller
      }
      this.upgradeController()
    }
  }

}

module.exports.Upgrader = Upgrader
