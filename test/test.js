const expect = require('chai').expect
const Lite = require('../index')

const describe = global.describe
const it = global.it

describe('Lite', () => {
  it('to :: should successfully animate between 0 and 1', done => {
    const o = { test: 0 }
    let prevValue = 0
    Lite.to(o, 1000, {
      test: 1,
      onUpdate() {
        expect(prevValue < o.test).to.equal(true)
        prevValue = o.test
      },
      onComplete() {
        expect(o.test).to.equal(1)
        done()
      },
    })

    setTimeout(() => {
      const mid = Math.round(o.test * 10) / 10
      expect(mid).to.equal(0.5)
    }, 500)
  })

  it('to :: should successfully animate multiple properties', done => {
    const o = { test: 0, foo: 50 }
    let prevValue = 0
    let prevValue2 = 0
    Lite.to(o, 1000, {
      test: 1,
      foo: 100,
      onUpdate() {
        expect(prevValue < o.test).to.equal(true)
        prevValue = o.test
        expect(prevValue2 < o.foo).to.equal(true)
        prevValue2 = o.foo
      },
      onComplete() {
        expect(o.test).to.equal(1)
        expect(o.foo).to.equal(100)
        done()
      },
    })

    setTimeout(() => {
      const mid = Math.round(o.test * 10) / 10
      expect(mid).to.equal(0.5)
    }, 500)
  })

  it('Should accept any easing function', done => {
    const updateValues = []
    Lite.to({ test: 0 }, 1000, {
      test: 1,
      ease() {
        return 0
      },
      onUpdate(obj) {
        updateValues.push(obj.test)
        expect(obj.test === 0 || obj.test === 1).to.equal(true)
      },
      onComplete(obj) {
        updateValues.forEach((v, i) => {
          if (i === updateValues.length - 1) expect(v).to.equal(1)
          else expect(v).to.equal(0)
        })
        expect(obj.test).to.equal(1)
        done()
      },
    })
  })
})

describe('Tween', () => {
  it('pause :: should successfully pause halfway between 0 and 1', done => {
    const o = { test: 0 }
    const tween = Lite.to(o, 1000, { test: 1 })

    // Pause halfway
    setTimeout(() => { tween.pause() }, 500)

    setTimeout(() => {
      const mid = Math.round(o.test * 10) / 10
      expect(mid).to.equal(0.5)
      done()
    }, 1000)
  })

  it('play :: should pause halfway between 0 and 1 and then continue to end', function t(done) {
    this.timeout(2500)
    let flag = false
    const o = { test: 0 }
    const tween = Lite.to(o, 1000, {
      test: 1,
      onComplete() {
        expect(o.test).to.equal(1)
        expect(flag).to.equal(true)
      },
    })

    // Pause halfway
    setTimeout(() => { tween.pause() }, 500)

    setTimeout(() => {
      const mid = Math.round(o.test * 10) / 10
      expect(mid).to.equal(0.5)
      tween.play()
      flag = true
      done()
    }, 1000)
  })

  it('play :: should play the animation again once complete', function t(done) {
    this.timeout(2500)
    let flag = false
    const o = { test: 0 }
    const tween = Lite.to(o, 1000, {
      test: 1,
      onComplete() {
        expect(o.test).to.equal(1)
        if (flag === false) {
          tween.play()
          flag = true
        } else {
          done()
        }
      },
    })
  })

  it('play :: should not have any effect if called during an animation', function t(done) {
    this.timeout(2500)
    let called = 0
    const o = { test: 0 }
    const tween = Lite.to(o, 1000, {
      test: 1,
      onComplete() {
        expect(o.test).to.equal(1)
        called++
        expect(called).to.equal(1)
      },
    })

    setTimeout(() => {
      tween.play()
    }, 500)

    setTimeout(() => {
      done()
    }, 2400)
  })

  it('kill :: should render the object dead and ready for gc', function t(done) {
    this.timeout(2500)
    const o = { test: 0 }
    const tween = Lite.to(o, 1000, {
      test: 1,
      onUpdate() {
        expect(o.test < 0.5).to.equal(true)
      },
    })

    let i = 0
    let killedValue = null
    const interval = setInterval(() => {
      i++
      if (killedValue) expect(killedValue).to.equal(o.test)
      switch (i) {
        case 1:
          tween.kill()
          killedValue = o.test
          break
        case 2:
          tween.play()
          break
        case 3:
          tween.pause()
          break
        case 4:
          tween.restart()
          break
        default:
          clearInterval(interval)
          done()
      }
    }, 400)
  })

  it('restart :: should restart the animation', function t(done) {
    this.timeout(2500)
    let flag = false
    const o = { test: 0 }
    let restartCount = 0
    const tween = Lite.to(o, 1000, {
      test: 1,
      onUpdate() {
        expect(o.test < 0.5).to.equal(true)
        if (flag) {
          restartCount++
          flag = false
        }
      },
    })

    let intervalCount = 0
    const interval = setInterval(() => {
      tween.restart()
      flag = true
      intervalCount++
      if (intervalCount >= 4) {
        clearInterval(interval)
        expect(restartCount).to.equal(3)
        done()
      }
    }, 400)
  })
})
