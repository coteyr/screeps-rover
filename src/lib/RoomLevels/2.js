/* global RoomLevel0 */

class RoomLevel2 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
  }
}

module.exports.RoomLevel1 = RoomLevel2

