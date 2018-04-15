const Tween = require('./src/Tween')

const Lite = {
  to: (v, d, o) => new Tween(v, d, o),
  ease: require('./src/easing'),
}

global.Lite = Lite
module.exports = Lite
