/* global Bootstrap */

/**
 * This is the base class for all Rooms
 * @param {room} the room to be processed
 */
class RoomLevel0 {
  constructor(room) {
    this.room = room
  }

  /**
   * My spawns
   * @return spawns in a room owned by me
   */
  get spawns() {
    return _.filter(Game.spawns, s => { return s.my && s.pos.roomName === this.room.name })
  }

  get creeps() {
    return _.filter(Game.creeps, c => { return c.my && c.pos.roomName === this.room.name})
  }

  run() {
    console.log(`Starting Tick for room: ${this.room.name}`)
  }

  run_spawns() {
    _.forEach(this.spawns, spawn => {
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${this.room.name}-${Game.time}`)
      }
    })
  }

  run_creeps() {
    _.forEach(this.creeps, function(creep) {
      let screep = new Bootstrap(creep)
      screep.run()
    })
  }

  get extensions() {
    return this.room.find(FIND_MY_STRUCTURES, { filter: s => { return s.structureType === STRUCTURE_EXTENSION }})
  }

  get construction_sites() {
    return this.room.find(FIND_MY_CONSTRUCTION_SITES)
  }

  get structures() {
    return this.room.find(FIND_MY_STRUCTURES)
  }

  get sources() {
    return this.room.find(FIND_SOURCES)
  }

  get flags() {
    return this.room.find(FIND_FLAGS)
  }

  get max_extensions() {
    return [0, 5, 10, 20, 30, 40, 50, 60][this.room.controller.level - 1]
  }

  get builders(){
    return _.filter(this.creeps, c => { return c.memory.type === 'builder' })
  }

  build_extensions() {
    if (this.extensions.length >= this.max_extensions) {
      return null
    }

    if (this.extensions.length + this.construction_sites.length >= this.max_extensions) {
      return null // This will return early if other things are being built.
      // This is ok for now.
    }

    let spots = this.room.lookAtArea(5,5,45,45, true)
    let sources = this.room.find(FIND_SOURCES)



    spots = _.filter(spots, s => { return s.type === 'terrain' && s.terrain === 'plain'})
    sources
    spots = _.sortBy(spots, s => {
      let ranges = []
      _.each(sources,  o => {
        let pos = new RoomPosition(s.x, s.y, this.room.name)
        ranges.push(pos.getRangeTo(o.pos))
      })
      return Math.lowest(ranges)
    })

    let location = null

    _.each(spots, s => {
      console.log(`Testing ${s.x}, ${s.y}`)
      let pos = new RoomPosition(s.x, s.y, this.room.name)
      let passed = true
      _.each(this.structures, u =>{
        if (pos.getRangeTo(u) <= 1) {
          passed = false
          return false
        }
      })


      _.each(this.sources, o => {
        if (o.pos.inRangeTo(s.x, s.y, 2)) {
          passed = false
          return false
        }
      })

      _.each(this.construction_sites, c => {
        if (c.pos.inRangeTo(s.x, s.y, 1)) {
          passed = false
          return false
        }
      })

      _.each(this.flags, f => {
        if (f.pos.inRangeTo(s.x, s.y, 1)) {
          passed = false
          return false
        }
      })

      _.each(this.room.lookAtArea(s.y - 1, s.x - 1, s.y + 1, s.x + 1, true), o => {
        if(o.type === 'terrain' && o.terrain === 'wall') {
          passed = false
          return false
        }
      })



      if(passed){
        location = s
        return false
      }

    })

    if(location){
      this.room.createConstructionSite(location.x, location.y, STRUCTURE_EXTENSION)
    }
  }
}

module.exports.RoomLevel0 = RoomLevel0
/* global RoomLevel0 */

class RoomLevel1 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
  }
}

module.exports.RoomLevel1 = RoomLevel1
/* global RoomLevel0 */

class RoomLevel2 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
  }
}

module.exports.RoomLevel1 = RoomLevel2

/* global RoomLevel0 */
/* global Bootstrap */
/* global Builder */
/* global Bodies */

class RoomLevel3 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
    this.run_builds()
  }

  run_creeps() {
    _.forEach(this.creeps, function(creep) {
      let screep = null
      switch(creep.memory.type) {
      case 'builder':
        screep = new Builder(creep)
        break
      default:
        screep = new Bootstrap(creep)
      }
      screep.run()
    })
  }

  run_builds() {
    this.build_extensions()
  }

  run_spawns() {
    _.forEach(this.spawns, spawn => {
      if(this.builders.length < 2 && spawn.store[RESOURCE_ENERGY] >= 300 && !spawn.spawning) {
        spawn.spawnCreep(Bodies.builder, `builder-${this.room.name}-${Game.time}`, { memory: { type: 'builder' } })
      }
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep(Bodies.bootstrap, `bootstrap-${this.room.name}-${Game.time}`, { memory: { type: 'bootstrap' } })
      }
    })

    super.run_spawns()
  }
}

module.exports.RoomLevel1 = RoomLevel3
/**
 * The Base Creep that all other creeps are based on
 * these methods should be useful my most/all creeps and should
 * help prevent having to have `this.creep` in the child classes
 * @constructor
 * @param {creep} creep - The creep wrapped by the BaseCreep object
 */
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

  choose_construction_site() {
    return Math.most_targeting(this.creep.room.find(FIND_MY_CONSTRUCTION_SITES), Game.creeps)
  }

  harvest() {
    if(this.creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  build() {
    if(this.creep.build(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
  }

  transfer() {
    if(this.creep.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
    if(this.creep.room.energyAvailable >= this.creep.room.energyCapacityAvailable && this.task === 'store') {
      this.task = null
    }
    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      if(this.creep.room.energyAvailable < this.creep.room.energyCapacityAvailable) {
        this.task = 'store'
        this.target = this.creep.pos.findClosestByRange(_.filter(this.creep.room.find(FIND_MY_STRUCTURES, {filter: s => { return (s.structureType === STRUCTURE_SPAWN || s.structureType == STRUCTURE_SPAWN) &&  s.store.getFreeCapacity(RESOURCE_ENERGY)}})))
      } else {
        this.task = 'upgrade'
        this.target = this.controller
      }
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
    } else if(this.task === 'store') {
      if(this.target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        this.target = null
      }
      if(!this.target) {
        this.target = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS)
      }
      this.transfer()
    } else {
      this.target = this.controller
      this.upgradeController()
    }
  }

}

module.exports.bootstrap = Bootstrap
/* global BaseCreep */

class Builder extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      this.task = 'build'
    } else if (this.empty) {
      this.task = 'mine'
    } else if (this.has_task) {
      return this.task
    } else {
      this.task = 'mine'
    }
  }

  run() {
    this.set_task()
    if(this.task === 'build') {
      if(!this.target) {
        this.target = this.choose_construction_site()
      }
      this.build()
    } else {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    }
  }

}

module.exports.Builder = Builder
class Bodies {

  constructor(room) {
    this.room = room
  }

  get bootstrap() {
    return ['WORK', 'CARRY', 'MOVE']
  }

  get builder() {
    let rank = {
      'WORK': 1,
      'CARRY': 2,
      'MOVE': 3
    }
    let max = this.room.energyCapacityAvailable
    let body = []
    while (max > 0) {
      max = max - 250
      if(max > 0) {
        body.push('WORK', 'CARRY', 'MOVE', 'MOVE')
      }
    }

    body = _.sortBy(body, _.propertyOf(rank))
    return body
  }
}

module.exports.Bodies = Bodies
class Math {
  static fewest_targeting(objects, creeps) {
    return _.first(this.order_by_targeting(objects, creeps))
  }

  static most_targeting(objects, creeps) {
    return _.last(this.order_by_targeting(objects, creeps))
  }

  static order_by_targeting(objects, creeps) {
    return _.sortBy(objects, o => {
      return _.filter(creeps, c => { return c.my && c.memory.target === o.id }).length
    })
  }


  static lowest(arry) {
    _.first(_.sortBy(arry, a => { return a }))
  }
}

module.exports.math = Math
/* global RoomLevel1 */
/* global RoomLevel2 */
/* global RoomLevel3 */

module.exports.loop = function() {
  _.forEach(Game.rooms, function(room){
    let sroom = null
    if(room.controller.my) {
      switch(room.controller.level) {
      case 1:
        sroom = new RoomLevel1(room)
        break
      case 2:
        sroom = new RoomLevel2(room)
        break
      case 3:
        sroom = new RoomLevel3(room)
        break
      default:
        sroom = new RoomLevel1(room)
      }
    } else {
      // hostel room
    }
    sroom.run()
  })
}
