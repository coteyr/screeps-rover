/* global RoomLevel1 */
/* global RoomLevel2 */
/* global RoomLevel3 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    let sroom = null
    if(room.controller.my) {
      switch(room.controller.level) {
      case 1:
        sroom = new RoomLevel1(room)
        break
      case 2:
        sroom = new RoomLevel2(room)
        break
      case 3:
        sroom = new RoomLevel3(room)
        break
      default:
        sroom = new RoomLevel1(room)
      }
    } else {
      // hostel room
    }
    sroom.run()
  })
}
