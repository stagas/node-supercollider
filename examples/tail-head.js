var sc = require('../supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})




// create a synth
lfo = sc.Synth('RingMod', [1 ,1, 'freq', 100])
sine = sc.Synth('sine', [1, 1, 'freq', 200, 'amp', 0.2])


//send to tail
setTimeout(function() {
    lfo.g_tail()
}, 500)

//send to head
setTimeout(function() {
    lfo.g_head()
}, 1500)

// free after 3000 ms
setTimeout(function() {
    sine.g_freeAll(); //syntax is not so clear but it frees all synths in the group...
  process.exit(0)
}, 3000)
