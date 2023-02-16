class Bootstrap {
  constructor(creep) {
    this.creep = creep
  }

  run() {
    console.log(`Running Bootstrap for ${this.creep.name}`)
  }
}

module.exports.bootstrap = Bootstrap
