var sc = require('../supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// create a synth
var sine = sc.Synth('sine', [1, 1, 'freq', 440, 'amp', 0.2])
var sc.s_get('sine')

// change amp after 500 ms
setTimeout(function() {
  sine.n_run(0)
  sine.n_trace()
}, 500)

// change amp after 500 ms
setTimeout(function() {
  sine.n_run(1)
}, 1000)

// free after 3000 ms
setTimeout(function() {
  sine.n_free(0)
  process.exit(0)
}, 3000)


