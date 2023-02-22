/* global BaseCreep */

class Miner extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    this.task = 'mine'
  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    }
  }

}

module.exports.Miner = Miner
