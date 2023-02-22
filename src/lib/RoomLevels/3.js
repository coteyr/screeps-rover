/* global RoomLevel0 */
/* global Bootstrap */
/* global Builder */
/* global Bodies */
/* global Miner */
/* global Upgrader */

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
      case 'upgrader':
        screep = new Upgrader(creep)
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
        console.log('need miner')
        console.log(body)
        spawn.spawnCreep(body, `miner-${this.room.name}-${Game.time}`, { memory: { type: 'miner' } })
      }
      if(this.upgraders.length < 1 && this.room.energyAvailable > 550 && !spawn.spawning) {
        let body = bodies.upgrader
        console.log('need upgrader')
        console.log(body)
        spawn.spawnCreep(body, `upgrader-${this.room.name}-${Game.time}`, { memory: { type: 'upgrader' } })
      }
    })

    super.run_spawns()
  }
}

module.exports.RoomLevel1 = RoomLevel3
