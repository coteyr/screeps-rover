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

  get has_construction_sites() {
    return this.construction_sites.length > 0
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

  get builders() {
    return _.filter(this.creeps, c => { return c.memory.type === 'builder' })
  }

  get miners() {
    return _.filter(this.creeps, c => { return c.memory.type === 'miner' })
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
/* global Miner */

class RoomLevel3 extends RoomLevel0 {
  run(room) {
    super.run(room)
    this.run_spawns()
    this.run_creeps()
    this.run_builds()
  }

  run_creeps() {
    // at 500 energy capacity
    // then move to stationary things
    // and transporters that move stuff between
    _.forEach(this.creeps, function(creep) {
      let screep = null
      switch(creep.memory.type) {
      case 'builder':
        screep = new Builder(creep)
        break
      case 'miner':
        screep = new Miner(creep)
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
    let bodies = new Bodies(this.room)
    _.forEach(this.spawns, spawn => {
      if(this.builders.length < 2 && this.has_construction_sites && this.room.energyAvailable >= 300 && !spawn.spawning) {
        let body = bodies.builder
        console.log('need builder')
        console.log(body)
        spawn.spawnCreep(body, `builder-${this.room.name}-${Game.time}`, { memory: { type: 'builder' } })
      }
      if(this.creeps.length < 5 && this.room.energyAvailable >= 150 && !spawn.spawning) {
        let body = bodies.bootstrap
        console.log('need bootstrap')
        console.log(body)
        spawn.spawnCreep(body, `bootstrap-${this.room.name}-${Game.time}`, { memory: { type: 'bootstrap' } })
      }
      if(this.miners.length < 2 && this.room.energyAvailable >= 550 && !spawn.spawning) {
        let body = bodies.miner
        console.log('need minder')
        console.log(body)
        spawn.spawnCreep(body, `miner-${this.room.name}-${Game.time}`, { memory: { type: 'miner' } })
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

  /**
   * Is the current creep's carry parts empty
   * @return {boolean} - true if the creeps has 0 energy, false otherwise.
   */
  get empty() {
    return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
  }

  /**
   * Is the current creep full of energy
   * @return {boolean} - true if the creep has no more room for energy, false otherwise
   */
  get full() {
    return this.creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0
  }

  /**
   * Does the current creep have any task at all
   * @return {boolean} - true if the creep has any task at all
   */
  get has_task() {
    return this.creep.memory.task ? true : false
  }

  /**
   * The task the current creep is trying to do
   * @return {string} - the task name the creep is trying to carry out
   */
  get task() {
    return this.creep.memory.task
  }

  /**
   * Get the controller for the room the creep is currently in
   * @return {StructureController} - The controller that is in the room the creep is in
   */
  get controller() {
    return this.creep.room.controller
  }

  /**
   * Set the task the creep should try to do
   * @param {string} value - The task that should be set
   */
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

  get has_static_miners() {
    return this.creep.room.energyCapacityAvailable > 550 //maybe check for miners?
  }

  choose_storage() {
    let structures = this.creep.room.find(FIND_MY_STRUCTURES)
    structures = _.filter(structures, s => { return ((s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) &&  s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 )})
    let tar = this.creep.pos.findClosestByRange(structures)
    return tar
  }

  choose_source() {
    return Math.fewest_targeting(this.creep.room.find(FIND_SOURCES), Game.creeps)
  }

  choose_energy() {
    return Math.fewest_targeting(this.creep.room.find(FIND_DROPPED_RESOURCES), Game.creeps)
  }

  choose_construction_site() {
    return Math.most_targeting(this.creep.room.find(FIND_MY_CONSTRUCTION_SITES), Game.creeps)
  }

  pickup() {
    if(this.creep.pickup(this.target) === ERR_NOT_IN_RANGE) {
      this.moveTo()
    }
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

    if (this.has_static_miners && this.task === 'mine') {
      this.task = 'collect'
    }

    if (!this.empty && !this.full && this.has_task) {
      return this.task
    } else if (this.full) {
      if(this.creep.room.energyAvailable < this.creep.room.energyCapacityAvailable) {
        this.task = 'store'
        this.target = this.choose_storage()
      } else {
        this.task = 'upgrade'
        this.target = this.controller
      }
    } else if (this.empty) {
      if (this.has_static_miners) {
        this.task = 'collect'
      } else {
        this.task = 'mine'
      }
    } else {
      if (this.has_static_miners) {
        this.task = 'collect'
      } else {
        this.task = 'mine'
      }
    }


  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    } else if(this.task === 'collect') {
      if(!this.target) {
        this.target = this.choose_energy()
      }
      this.pickup()

    } else if(this.task === 'store') {
      if(this.target && this.target.store && this.target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        this.target = null
      }
      if(!this.target) {
        this.target =  this.choose_storage()
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
/* global BaseCreep */

class Miner extends BaseCreep {
  constructor(creep) {
    super(creep)
  }

  set_task() {
    this.task = 'mine'
  }

  run() {
    this.set_task()
    if(this.task === 'mine') {
      if(!this.target) {
        this.target = this.choose_source()
      }
      this.harvest()
    }
  }

}

module.exports.Miner = Miner
class Bodies {

  constructor(room) {
    this.room = room
  }

  get bootstrap() {
    return [WORK, CARRY, MOVE]
  }

  get builder() {
    let rank = {
      WORK: 1,
      CARRY: 2,
      MOVE: 3
    }
    let max = this.room.energyCapacityAvailable
    let body = []
    while (max > 0) {
      max = max - 250
      if(max > 0) {
        body = body.concat([WORK, CARRY, MOVE, MOVE])
      }
    }

    body = _.sortBy(body, _.propertyOf(rank))
    return body
  }
  get miner() {
    return [WORK, WORK, WORK, WORK, WORK, MOVE]
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
