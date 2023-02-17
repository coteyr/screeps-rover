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
}

module.exports.math = Math
