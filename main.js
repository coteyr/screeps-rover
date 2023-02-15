module.exports = {
	run(room) {
		console.log(room.name)
	}
}module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
