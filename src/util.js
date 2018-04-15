const raf = require('./raf')

const util = {
  lerp(source, target, amount) {
    return source + (amount * (target - source))
  },
  _check(type, value, _default, override) {
    return typeof value === type ? value : (override || _default)
  },
  checkNum(number, override) {
    return util._check('number', number, null, override)
  },
  checkFunc(func, override) {
    return util._check('function', func, _ => _, override)
  },
  raf: _ => raf(_),
}

module.exports = util
