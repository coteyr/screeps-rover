// eslint-disable-next-line no-unused-vars
class RoomLevel1 {
  static run(room) {
    console.log(`tarting Tick for room: ${room.name}`)
    let spawns = _.filter(Game.spawns, function(spawn) {
      return spawn.pos.roomName === room.name
    })
    _.forEach(spawns, function(spawn) {
      if(spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${Game.tick}`)
      }
    })

  }
}

/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
