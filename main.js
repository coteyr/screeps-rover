/* global Bootstrap */

class RoomLevel1 {
  static run(room) {
    console.log(`tarting Tick for room: ${room.name}`)
    let spawns = _.filter(Game.spawns, function(spawn) {
      return spawn.pos.roomName === room.name
    })
    _.forEach(spawns, function(spawn) {
      if(spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${room.name}-${Game.time}`)
      }
    })
    let creeps = _.filter(Game.creeps, function(creep) {
      return creep.my && creep.pos.roomName == room.name
    })
    _.forEach(creeps, function(creep) {
      let screep = new Bootstrap(creep)
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
    let creep = this.creep
    let source = _.first(creep.room.find(FIND_SOURCES))

    if(creep.store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
      if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    } else {
      if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  }
}

module.exports.bootstrap = Bootstrap
/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
