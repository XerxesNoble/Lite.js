(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var Tween = require('./src/Tween');

var Lite = {
  to: function to(v, d, o) {
    return new Tween(v, d, o);
  },
  ease: require('./src/easing')
};

global.Lite = Lite;
module.exports = Lite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/Tween":2,"./src/easing":3}],2:[function(require,module,exports){
'use strict';

var util = require('./util');
var easing = require('./easing');

function Tween(values, duration, options) {
  this.values = values;
  this.duration = duration;
  this.options = options;

  // Ensure methods.
  this.onComplete = util.checkFunc(options.onComplete);
  this.onUpdate = util.checkFunc(options.onUpdate);
  this.ease = util.checkFunc(options.ease, easing.linear

  // Animation control flags
  );this.start = Date.now();
  this.killed = false;
  this.paused = false;
  this._loop = false;
  this.done = false;
  this._pausedTimeDiff = 0;

  // Create a map (< key: [from, to] >)
  this._animationMap = Object.keys(values).reduce(function (map, key) {
    var _from = util.checkNum(values[key]);
    var _to = util.checkNum(options[key]);
    if (_from !== null && _to !== null) map[key] = [_from, _to];
    return map;
  }, {}

  // List of animating values
  );this.keys = Object.keys(this._animationMap);

  this._run = this._run.bind(this);
  util.raf(this._run);
}

Tween.prototype = {
  // Create & run animation function
  _run: function _run() {
    var _this = this;

    if (this.killed || this.paused) return;
    var now = Date.now();
    var t = this.duration > 0 ? (now - this.start) / this.duration : 1;
    // Update all values using 't'
    this.keys.forEach(function (key) {
      // If both 'from' and 'to' are numbers: animate!
      var fromTo = _this._animationMap[key];
      var progress = _this.ease(t
      // Update value
      );_this.values[key] = util.lerp(fromTo[0], fromTo[1], progress);
    }

    // If complete..
    );if (t >= 1) {
      this.done = true;
      // Final update for all keys
      this.keys.forEach(function (key) {
        return _this.values[key] = _this.options[key];
      });
      this.onUpdate(this.values);
      this.onComplete(this.values);
      if (this._loop) this.play();
    } else {
      // Run update callback and loop until finished
      this.onUpdate(this.values);
      util.raf(this._run);
    }
  },
  kill: function kill() {
    this.killed = true;
  },
  pause: function pause() {
    // If not paused and not done...
    if (!this.paused && !this.done) {
      // Apply paused flag for loop exit
      this.paused = true;
      // Save time diff from start to now
      this._pausedTimeDiff = Date.now() - this.start;
    }
  },
  play: function play() {
    // If either paused or done...
    if (this.paused || this.done) {
      // Reset flags
      this.paused = false;
      this.done = false;
      // Set new start time and reset time difference
      this.start = Date.now() - this._pausedTimeDiff;
      this._pausedTimeDiff = 0;
      // Start the loop again
      util.raf(this._run);
    }
  },
  restart: function restart() {
    var _this2 = this;

    if (this.killed) return;
    // Set values back to initial values
    this.keys.forEach(function (key) {
      return _this2.values[key] = _this2._animationMap[key][0];
    }
    // Update start time to now
    );this.start = Date.now
    // Reset flags and loop
    ();if (this.paused || this.done) {
      this.done = false;
      this.paused = false;
      this.pausedTimeDiff = 0;
      util.raf(this._run);
    }
  },
  loop: function loop() {
    this._loop = true;
    this.play();
    return this;
  }
};

module.exports = Tween;

},{"./easing":3,"./util":5}],3:[function(require,module,exports){
"use strict";

// https://gist.github.com/gre/1650294
var ease = {
  in: function _in(power) {
    return function (t) {
      return Math.pow(t, power);
    };
  },
  out: function out(power) {
    return function (t) {
      return 1 - Math.abs(Math.pow(t - 1, power));
    };
  },
  inOut: function inOut(power) {
    return function (t) {
      return t < 0.5 ? ease.in(power)(t * 2) / 2 : ease.out(power)(t * 2 - 1) / 2 + 0.5;
    };
  }
};

module.exports = {
  linear: ease.inOut(1),
  inQuad: ease.in(2),
  outQuad: ease.out(2),
  inOutQuad: ease.inOut(2),
  inCubic: ease.in(3),
  outCubic: ease.out(3),
  inOutCubic: ease.inOut(3),
  inQuart: ease.in(4),
  outQuart: ease.out(4),
  inOutQuart: ease.inOut(4),
  inQuint: ease.in(5),
  outQuint: ease.out(5),
  inOutQuint: ease.inOut(5),
  inElastic: function inElastic(t) {
    return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
  },
  outElastic: function outElastic(t) {
    return .04 * t / --t * Math.sin(25 * t);
  },
  inOutElastic: function inOutElastic(t) {
    return (t -= 0.5) < 0 ? (0.01 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
  },
  inSin: function inSin(t) {
    return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
  },
  outSin: function outSin(t) {
    return Math.sin(Math.PI / 2 * t);
  },
  inOutSin: function inOutSin(t) {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }
};

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function () {
  var requestAnimationFrame = global.requestAnimationFrame;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
  }

  if (!requestAnimationFrame) {
    var lastTime = 0;
    requestAnimationFrame = function requestAnimationFrame(callback) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = global.setTimeout(function () {
        return callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  return requestAnimationFrame;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _raf = require('./raf');

var util = {
  lerp: function lerp(source, target, amount) {
    return source + amount * (target - source);
  },
  _check: function _check(type, value, _default, override) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type ? value : override || _default;
  },
  checkNum: function checkNum(number, override) {
    return util._check('number', number, null, override);
  },
  checkFunc: function checkFunc(func, override) {
    return util._check('function', func, function (_) {
      return _;
    }, override);
  },

  raf: function raf(_) {
    return _raf(_);
  }
};

module.exports = util;

},{"./raf":4}]},{},[1]);
