module.exports = (() => {
  let requestAnimationFrame = global.requestAnimationFrame
  const vendors = ['ms', 'moz', 'webkit', 'o']
  for (let x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    requestAnimationFrame = global[`${vendors[x]}RequestAnimationFrame`]
  }

  if (!requestAnimationFrame) {
    let lastTime = 0
    requestAnimationFrame = callback => {
      const currTime = Date.now()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = global.setTimeout(() => callback(currTime + timeToCall), timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  return requestAnimationFrame
})()
