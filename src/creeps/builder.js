/* global BaseCreep */

class Builder extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      this.task = 'build'
    } else if (this.empty) {
      this.task = 'mine'
    } else if (this.has_task) {
      return this.task
    } else {
      this.task = 'mine'
    }
  }

  run() {
    this.set_task()
    if(this.task === 'build') {
      if(!this.target) {
        this.target = this.choose_construction_site()
      }
      this.build()
    } else {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    }
  }

}

module.exports.Builder = Builder
