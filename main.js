module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    let roomLevel = require('RoomLevels/1')
    roomLevel.run(room)
  })
}