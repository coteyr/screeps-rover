class RoomLevel0 {
  constructor(room) {
    this.room = room
  }


  get spawns() {
    return _.filter(Game.spawns, s => { return s.my && s.pos.roomName === this.room.name })
  }

  get creeps() {
    return _.filter(Game.creeps, c => { return c.my && c.pos.roomName === this.room.name})
  }

  run(room) {
    console.log(`Starting Tick for room: ${room.name}`)

    _.forEach(this.spawns, spawn => {
      if(this.creeps.length < 5 && spawn.store[RESOURCE_ENERGY] >= 150 && !spawn.spawning) {
        spawn.spawnCreep([WORK, MOVE, CARRY], `bootstrap-${room.name}-${Game.time}`)
      }
    })
  }
}

module.exports.RoomLevel0 = RoomLevel0
