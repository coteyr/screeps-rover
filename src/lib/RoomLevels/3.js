/* global RoomLevel0 */
/* global Bootstrap */
/* global Builder */
/* global Miner */
/* global Upgrader */
/* global Carrier */

class RoomLevel3 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
    this.run_builds()
  }

  run_creeps() {
    // at 500 energy capacity
    // then move to stationary things
    // and transporters that move stuff between
    _.forEach(this.creeps, function(creep) {
      let screep = null
      switch(creep.memory.type) {
      case 'builder':
        screep = new Builder(creep)
        break
      case 'miner':
        screep = new Miner(creep)
        break
      case 'upgrader':
        screep = new Upgrader(creep)
        break
      case 'carrier':
        screep = new Carrier(creep)
        break
      default:
        screep = new Bootstrap(creep)
      }
      screep.run()
    })
  }

  run_builds() {
    this.build_extensions()
  }


  run_spawns() {
    _.forEach(this.spawns, spawn => {
      this.need_creeps(spawn, 2, 'builder', 300, this.has_construction_sites)
      this.need_creeps(spawn, 2, 'miner', 550, true)
      this.need_creeps(spawn, 1, 'upgrader', 550, true)
      this.need_creeps(spawn, 4, 'carrier', 550, true)
      this.need_creeps(spawn, 5, 'bootstrap', 150, this.creeps.length < 5)
    })

    super.run_spawns()
  }
}

module.exports.RoomLevel1 = RoomLevel3
