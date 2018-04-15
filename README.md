# Lite.js

A lightweight **( 5kb minified )**, bare bones, javascript animation engine with some handy easing functions.

[View Demo](https://xerxesnoble.github.io/Lite.js/)

## Usage:

```javascript
const tween = Lite.to({ foo: 24, bar: 50 }, 1000, {
  foo: 42,
  bar: 100,
  onUpdate: (obj) => console.log(obj.foo, obj.bar),
  onComplete: (obj) => console.log('Done!', obj),
  ease: Lite.ease.inOutElastic
})

// tween.pause()
// tween.play()
// tween.restart()
// tween.loop()
// tween.kill()
```

## Controls

Each created tween has a set of controls available:

| Method    | Description                         |
|:---------:|:----------------------------------- |
| pause()   | pause playing animation             |
| play()    | play paused animation               |
| restart() | restart playing or paused animation |
| loop()    | loop animation until killed         |
| kill()    | kill animation                      |


## Easing

Some helpful easing functions from <https://gist.github.com/gre/1650294>

Accessible through `Lite.ease`

| Ease         | Description                                    |
|:------------:|:-----------------------------------------------|
| linear       | no easing, no acceleration                     |
| inQuad       | accelerating from zero velocity                |
| outQuad      | decelerating to zero velocity                  |
| inOutQuad    | acceleration until halfway, then deceleration  |
| inCubic      | accelerating from zero velocity                |
| outCubic     | decelerating to zero velocity                  |
| inOutCubic   | acceleration until halfway, then deceleration  |
| inQuart      | accelerating from zero velocity                |
| outQuart     | decelerating to zero velocity                  |
| inOutQuart   | acceleration until halfway, then deceleration  |
| inQuint      | accelerating from zero velocity                |
| outQuint     | decelerating to zero velocity                  |
| inOutQuint   | acceleration until halfway, then deceleration  |
| inElastic    | elastic bounce effect at the beginning         |
| outElastic   | elastic bounce effect at the end               |
| inOutElastic | elastic bounce effect at the beginning and end |
| inSin        | accelerating from zero velocity                |
| outSin       | accelerating to zero velocity                  |
| inOutSin     | acceleration until halfway, then deceleration  |
