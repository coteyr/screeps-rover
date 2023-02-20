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
/* global RoomLevel0 */

class RoomLevel1 extends RoomLevel0 {
  static run(room) {
    super.run(room)
  }
}

module.exports.RoomLevel1 = RoomLevel1

class BaseCreep {
  constructor(creep) {
    this.creep = creep
  }

  get empty() {
    return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
  }

  get full() {
    return this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0
  }

  get has_task() {
    return this.creep.memory.task ? true : false
  }

  get task() {
    return this.creep.memory.task
  }

  get controller() {
    return this.creep.room.controller
  }

  set task(value) {
    if(this.creep.memory.task !== value) {
      this.creep.memory.task = value
      this.target = null
    }
  }


  get memory() {
    return this.creep.memory
  }

  get target() {
    let id = this.creep.memory.target
    return Game.getObjectById(id)
  }

  set target(value) {
    if(value === null) {
      this.creep.memory.target = null
    } else {
      this.creep.memory.target = value.id
    }
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
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

module.exports.creeps_base = BaseCreep
/* global BaseCreep */

class Bootstrap extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (!this.empty && !this.full && this.has_task) {
      return null
    } else if (this.full) {
      this.task = 'upgrade'
      this.target = this.controller
    } else if (this.empty) {
      this.task = 'mine'
    } else {
      this.task = 'mine'
    }
  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    } else {
      this.target = this.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
class Math {
  static fewest_targeting(objects, creeps) {
    let least = 1000
    let result = null
    _.each(objects, o => {
      let count = _.filter(creeps, c => {return c.my  && c.memory.target === o.id}).length
      if (count <= least){
        least = count
        result = o
      }
    })
    return result
  }
}

module.exports.math = Math
/* global RoomLevel1 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    RoomLevel1.run(room)
  })
}
