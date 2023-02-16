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
    if(this.task === 'mine') {
      this.harvest()
    } else {
      this.upgradeController()
    }
  }

  get target() {
    return _.first(this.creep.room.find(FIND_SOURCES))
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.memory.task) {
      return this.creep.memory.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      return 'upgrade'
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      this.task = 'mine'
      return 'mine'
    } else {
      this.task = 'mine'
      return 'mine'
    }
  }

  set task(value) {
    this.creep.memory.task = value
  }

  get memory() {
    return this.creep.memory
  }

  harvest() {
    if(this.creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  moveTo() {
    this.creep.moveTo(this.target)
  }

  upgradeController() {
    if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.room.controller)
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
