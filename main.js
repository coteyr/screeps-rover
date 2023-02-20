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

    _.forEach(this.spawns, spawn => {
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${this.room.name}-${Game.time}`)
      }
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

  build_extensions() {
    let max_extensions = [0, 5, 10, 20, 30, 40, 50, 60][this.room.controller.level - 1]
    if (this.extensions >= max_extensions) {
      return null
    }

    if (this.extensions + this.construction_sites >= max_extensions) {
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
    console.log(_.first(spots).x)
    console.log(_.first(spots).y)
    let location = null

    _.each(spots, s => {
      console.log(`Testing ${s.x}, ${s.y}`)
      let pos = new RoomPosition(s.x, s.y, this.room.name)
      let passed = true
      _.each(this.structures, u =>{
        if (pos.getRangeTo(u) <= 1) {
          passed = false
          console.log('failed: structure')
          console.log(pos.getRangeTo(u))
          return
        }
      })

      _.each(this.sources, o => {
        if (pos.getRangeTo(o) <= 1) {
          passed = false
          console.log('failed: source')
          console.log(pos.getRangeTo(o))
          return
        }
      })

      // not near wall
      // not near construction spot
      // not near flag

      if(passed){
        location = s
        return s
      }

    })

    if(location){
      this.room.createConstructionSite(location.x, location.y, STRUCTURE_EXTENSION)
    }



    // List the potentials positions (ie: all plain or swamp tiles of the room).
    // Remove tiles which don't fit some arbitrary rules (ie: in your case, filter all tiles where (x + y) % 2 === 0 which will create a checker pattern)
    // Score the remaining tile based, for example, on distance and keep the best one (ie: use (pos) => spawn.pos.getRangeTo(pos) function to score and keep the minimum).

    // not near a source - 3
    // not near an edge - 5



  }
}

module.exports.RoomLevel0 = RoomLevel0
/* global RoomLevel0 */
/* global Bootstrap */

class RoomLevel1 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_creeps()
  }

  run_creeps() {
    _.forEach(this.creeps, function(creep) {
      let screep = new Bootstrap(creep)
      screep.run()
    })
  }
}

module.exports.RoomLevel1 = RoomLevel1
/* global RoomLevel0 */

class RoomLevel2 extends RoomLevel0 {
  static run(room) {
    super.run(room)
  }
}

module.exports.RoomLevel1 = RoomLevel2
/* global RoomLevel0 */
/* global Bootstrap */

class RoomLevel3 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_creeps()
    this.run_builds()
  }

  run_creeps() {
    _.forEach(this.creeps, function(creep) {
      let screep = new Bootstrap(creep)
      screep.run()
    })
  }

  run_builds() {
    this.build_extensions()
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

  static lowest(arry) {
    let least = 1000000
    let result = null
    _.each(arry, a => {
      if(a < least) {
        least = a
        result = a
      }
    })
    return result
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
