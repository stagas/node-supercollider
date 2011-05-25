var sc = require('../supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// create  synths
lfo = sc.Synth('RingMod', [1,1,'freq',10])
sine = sc.Synth('sine', [1, 1, 'freq', 440, 'amp', 0.2])


//apply lfo
setTimeout(function(){
    sine.before(lfo.node)
},1000)

//move out lfo
setTimeout(function(){
    sine.after(lfo.node)
},2000)



// free 
setTimeout(function() {
  sine.free()
    lfo.free()
     process.exit(0)
}, 3000)

