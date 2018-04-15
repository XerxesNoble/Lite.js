const util = require('./util')
const easing = require('./easing')

function Tween(values, duration, options) {
  this.values = values
  this.duration = duration
  this.options = options

  // Ensure methods.
  this.onComplete = util.checkFunc(options.onComplete)
  this.onUpdate = util.checkFunc(options.onUpdate)
  this.ease = util.checkFunc(options.ease, easing.linear)

  // Animation control flags
  this.start = Date.now()
  this.killed = false
  this.paused = false
  this._loop = false
  this.done = false
  this._pausedTimeDiff = 0

  // Create a map (< key: [from, to] >)
  this._animationMap = Object.keys(values).reduce((map, key) => {
    const _from = util.checkNum(values[key])
    const _to = util.checkNum(options[key])
    if (_from !== null && _to !== null) map[key] = [_from, _to]
    return map
  }, {})

  // List of animating values
  this.keys = Object.keys(this._animationMap)

  this._run = this._run.bind(this)
  util.raf(this._run)
}

Tween.prototype = {
  _run() {
    if (this.killed || this.paused) return
    const now = Date.now()
    const t = this.duration > 0 ? (now - this.start) / this.duration : 1
    // Update all values using 't'
    this.keys.forEach(key => {
      // If both 'from' and 'to' are numbers: animate!
      const fromTo = this._animationMap[key]
      const progress = this.ease(t)
      // Update value
      this.values[key] = util.lerp(fromTo[0], fromTo[1], progress)
    })

    // If complete..
    if (t >= 1) {
      this.done = true
      // Final update for all keys
      this.keys.forEach(key => (this.values[key] = this.options[key]))
      this.onUpdate(this.values)
      this.onComplete(this.values)
      if (this._loop) this.play()
    } else {
      // Run update callback and loop until finished
      this.onUpdate(this.values)
      util.raf(this._run)
    }
  },

  kill() {
    this.killed = true
  },

  pause() {
    // If not paused and not done...
    if (!this.paused && !this.done) {
      // Apply paused flag for loop exit
      this.paused = true
      // Save time diff from start to now
      this._pausedTimeDiff = Date.now() - this.start
    }
  },

  play() {
    // If either paused or done...
    if (this.paused || this.done) {
      // Reset flags
      this.paused = false
      this.done = false
      // Set new start time and reset time difference
      this.start = Date.now() - this._pausedTimeDiff
      this._pausedTimeDiff = 0
      // Start the loop again
      util.raf(this._run)
    }
  },

  restart() {
    if (this.killed) return
    // Set values back to initial values
    this.keys.forEach(key => (this.values[key] = this._animationMap[key][0]))
    // Update start time to now
    this.start = Date.now()
    // Reset flags and loop
    if (this.paused || this.done) {
      this.done = false
      this.paused = false
      this.pausedTimeDiff = 0
      util.raf(this._run)
    }
  },

  loop() {
    this._loop = true
    this.play()
    return this
  },
}

module.exports = Tween
