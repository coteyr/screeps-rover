class RoomLevel1 {
  static run(room) {
    console.log(room.name)
    // Added a comment
  }
}
module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
