/* global RoomLevel0 */
/* global Bootstrap */
/* global Builder */

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
        spawn.spawnCreep([WORK, WORK, MOVE, CARRY], `builder-${this.room.name}-${Game.time}`, { memory: { type: 'buiilder' } })
      }
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${this.room.name}-${Game.time}`, { memory: { type: 'bootstrap' } })
      }
    })

    super.run_spawns()
  }
}

module.exports.RoomLevel1 = RoomLevel3
