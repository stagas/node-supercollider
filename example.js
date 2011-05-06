var sc = require('./supercollider')()

// listen on all messages
sc.on('message', function(message, address) {
  console.log('message:', message, address)
})

// talk to server
sc.send('/dumpOSC', 1, dump)
sc.send('/notify', 1, dump)
sc.send('/status', dump)

// synthdef sine
var sine
sc.send('/s_new', 'sine', (sine = sc.nextNodeId()), 1, 1, dump)

// stop sound after 2 seconds
setTimeout(function() {
  sc.send('/n_free', sine, dump)
  process.exit(0)
}, 2000)

// debug function
function dump() {
  var args = [].slice.call(arguments)
  if (args[0]) console.log('error:', args[0])
  args[0] = 'reply:'
  console.log.apply(console, args)
}