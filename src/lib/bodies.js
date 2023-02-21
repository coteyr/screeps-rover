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
    console.log(body)
    return body.flat()
  }
}

module.exports.Bodies = Bodies
