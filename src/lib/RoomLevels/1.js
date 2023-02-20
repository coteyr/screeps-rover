/* global RoomLevel0 */
/* global Bootstrap */

class RoomLevel1 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_creeps()
  }

  run_creeps() {
    _.forEach(this.creeps, function(creep) {
      let screep = new Bootstrap(creep)
      screep.run()
    })
  }
}

module.exports.RoomLevel1 = RoomLevel1
