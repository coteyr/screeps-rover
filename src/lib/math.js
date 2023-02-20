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
