/* global Bootstrap */

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
    let creeps = _.filter(Game.creeps, function(creep) {
      return creep.my && creep.pos.roomName == room.name
    })
    _.forEach(creeps, function(creep) {
      let screep = Bootstrap.new(creep)
      screep.run()
    })

  }
}

module.exports.RoomLevel1 = RoomLevel1
class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    console.log(`Running Bootstrap for ${this.creep.name}`)
  }
}

module.exports.bootstrap = Bootstrap
/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
