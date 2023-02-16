/* global Bootstrap */

class RoomLevel1 {
  static run(room) {
    console.log(`tarting Tick for room: ${room.name}`)
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

module.exports.RoomLevel1 = RoomLevel1
class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    } else {
      this.upgradeController()
    }
  }

  get task() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.creep.memory.task) {
      return this.creep.memory.task
    } else if (this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
      this.task = 'upgrade'
      this.target = this.creep.room.controller
      return 'upgrade'
    } else if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
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

  get target() {
    let id = this.creep.memory.target
    return Game.getObjectById(id)
  }

  set target(value) {
    this.creep.memory.target = value.id
  }

  choose_source() {
    let least = 1000
    let result = null
    _.each(this.creep.room.find(FIND_SOURCES), s => {
      let count = _.filter(Game.creeps, c => {return c.my  && c.memory.target === s.id}).length
      if (count <= least){
        least = count
        result = s
      }
    })
    return result
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
