/* global Bootstrap */

class RoomLevel0 {
  static run(room) {
    console.log(`Starting Tick for room: ${room.name}`)
    let spawns = _.filter(Game.spawns, function(spawn) {
      return spawn.pos.roomName === room.name
    })
    let creeps = _.filter(Game.creeps, function(creep) {
      return creep.my && creep.pos.roomName == room.name
    })
    _.forEach(spawns, function(spawn) {
      if(creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${room.name}-${Game.time}`)
      }
    })

    _.forEach(creeps, function(creep) {
      let screep = new Bootstrap(creep)
      screep.run()
    })

  }
}

module.exports.RoomLevel0 = RoomLevel0
