var sc = require('../supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// create  synths
var lfo = sc.Synth('RingMod', [1,1,'freq',10])
var sine = sc.Synth('sine', [1, 1, 'freq', 440, 'amp', 0.2])

//apply lfo
setTimeout(function(){
  sine.n_before(lfo.node)
},1000)

//move out lfo
setTimeout(function(){
  sine.n_after(lfo.node)
},2000)

// free 
setTimeout(function() {
  sine.n_free()
  lfo.n_free()
  process.exit(0)
}, 3000)

