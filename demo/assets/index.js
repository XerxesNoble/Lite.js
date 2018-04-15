var demos = [
  {
    name: 'a',
    tween: function(box) {
      return Lite.to({ scale: 1 }, 2000, {
        scale: 0.3,
        onUpdate: function(obj) {
          setVendor(box, 'Transform', 'scale(' + obj.scale + ')')
        }
      })
    }
  },
  {
    name: 'b',
    tween: function(box) {
      return Lite.to({ r: 81, g: 45 , b: 186 }, 1000, {
        r: 0,
        g: 150,
        b: 136,
        onUpdate: function(obj) {
          const rgb = [obj.r, obj.g, obj.b].map(Math.round)
          box.style.background = 'rgb(' + rgb.join() + ')'
        }
      })
    }
  },
  {
    name: 'c',
    tween: function(box) {
      return Lite.to({ rotate: 0 }, 10000, {
        rotate: 360,
        onUpdate: function(obj) {
          setVendor(box, 'Transform', 'scale(0.4) rotate(' + obj.rotate + 'deg)')
        }
      }).loop()
    }
  },
  {
    name: 'd',
    tween: function(box) {
      return Lite.to({ rotate: 0, scale: 0.2 }, 2000, {
        rotate: 180,
        scale: 0.8,
        onUpdate: function(obj) {
          setVendor(box, 'Transform', 'scale(' + obj.scale + ') rotate(' + obj.rotate + 'deg)')
        },
        ease: Lite.ease.inElastic
      })
    }
  },
]

demos.forEach(function(demo) {
  var box = document.getElementById('demo-box-' + demo.name)
  applyControls(demo.tween(box), demo.name)
})

function setVendor(element, property, value) {
  element.style["webkit" + property] = value;
  element.style["moz" + property] = value;
  element.style["ms" + property] = value;
  element.style["o" + property] = value;
}

function applyControls(tween, letter) {
  document.getElementById(letter + '-play').onclick = tween.play.bind(tween)
  document.getElementById(letter + '-pause').onclick = tween.pause.bind(tween)
  document.getElementById(letter + '-restart').onclick = tween.restart.bind(tween)
}
