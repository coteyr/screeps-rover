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

  get upgrader() {
    let rank = {
      WORK: 1,
      CARRY: 2,
      MOVE: 3
    }
    let max = this.room.energyCapacityAvailable - 50
    let body = [MOVE]
    while (max > 0) {
      max = max - 150
      if(max > 0) {
        body = body.concat([WORK, CARRY])
      }
    }

    body = _.sortBy(body, _.propertyOf(rank))
    return body
  }
}

module.exports.Bodies = Bodies
