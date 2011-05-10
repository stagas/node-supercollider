var sc = require('./supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// talk to server
sc.send('/dumpOSC', 1)
sc.send('/notify', 1)
sc.send('/status')

sc.send('/g_freeAll', [0])
sc.send('/clearSched')
sc.send('/g_new', [1, 0, 0])

// synthdef sine
sc303 = sc.Synth('sc303', [1, 1])
sc303.set('gate', 1, 'freq', 220);
sc303.set('gate', 0);
sc303.set('dec', 1);
sc303.free()

setInterval(function() {
  // synthdef sine
  sc303 = sc.Synth('sc303', [1, 1])
  sc303.set('gate', 1, 'freq', 200 + (Math.random() * 100 | 0));
  sc303.set('gate', 0);
  sc303.set('dec', 1);
  setTimeout(function() {
    sc303.free()
  }, 200)
}, 472)

// debug function
function dump() {
  var args = [].slice.call(arguments)
  if (args[0]) console.log('error:', args[0])
  args[0] = 'reply:'
  console.log.apply(console, args)
}