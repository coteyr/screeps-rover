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
    let bodies = new Bodies(this.room)
    _.forEach(this.spawns, spawn => {
      if(this.builders.length < 2 && spawn.store[RESOURCE_ENERGY] >= 300 && !spawn.spawning) {
        console.log(spawn.spawnCreep([bodies.builder].flat(), `builder-${this.room.name}-${Game.time}`, { memory: { type: 'builder' } }))
      }
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep(bodies.bootstrap, `bootstrap-${this.room.name}-${Game.time}`, { memory: { type: 'bootstrap' } })
      }
    })

    super.run_spawns()
  }
}

module.exports.RoomLevel1 = RoomLevel3
