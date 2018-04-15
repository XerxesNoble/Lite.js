// https://gist.github.com/gre/1650294
const ease = {
  in: power => t => Math.pow(t, power),
  out: power => t => 1 - Math.abs(Math.pow(t - 1, power)),
  inOut: power => t => t < 0.5 ? ease.in(power)(t * 2) / 2 : ease.out(power)(t * 2 - 1) / 2 + 0.5,
}

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
  inElastic: t => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
  outElastic: t => .04 * t / (--t) * Math.sin(25 * t),
  inOutElastic: t => (t -= 0.5) < 0 ? (0.01 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
  inSin: t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
  outSin: t => Math.sin(Math.PI / 2 * t),
  inOutSin: t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
}
