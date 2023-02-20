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
        if (pos.getRangeTo(u) <= 2) {
          passed = false
          console.log('failed: structure')
          console.log(pos.getRangeTo(u))
          return false
        }
      })

      _.each(this.sources, o => {
        if (pos.getRangeTo(o) <= 2) {
          passed = false
          console.log('failed: source')
          console.log(pos.getRangeTo(o))
          return false
        }
      })

      // not near wall
      // not near construction spot
      // not near flag

      if(passed){
        location = s
        return false
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
