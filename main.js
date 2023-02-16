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

    if(creep.task === 'mine') {
      if(creep.harvest(creep.target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.target)
      }
    } else {
      if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  }

  get target() {
    return _.first(this.creep.room.find(FIND_SOURCES))
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.task) {
      return this.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      return 'upgrade'
    } else {
      this.task = 'mine'
      return 'mine'
    }
  }

  set task(value) {
    this.memory.task = value
  }

  get memory() {
    return this.creep.memory
  }
}

module.exports.bootstrap = Bootstrap
/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
