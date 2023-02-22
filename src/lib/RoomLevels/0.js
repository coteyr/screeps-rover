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

  get upgraders() {
    return _.filter(this.creeps, c => { return c.memory.type === 'upgrader' })
  }

  get carriers() {
    return _.filter(this.creeps, c => { return c.memory.type === 'carrier' })
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
