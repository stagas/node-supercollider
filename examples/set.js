var sc = require('../supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// create a synth
sine = sc.Synth('sine', [1, 1, 'freq', 440, 'amp', 0.2])

// change amp after 500 ms
setTimeout(function() {
  sine.set('freq', 200)
}, 500)

// free after 3000 ms
setTimeout(function() {
  sine.free()
  process.exit(0)
}, 3000)