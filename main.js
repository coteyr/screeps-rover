// eslint-disable-next-line no-unused-vars
class RoomLevel1 {
  static run(room) {
    console.log(`tarting Tick for room: ${room.name}`)
  }
}

/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
