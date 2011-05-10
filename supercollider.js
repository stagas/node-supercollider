var util = require('util')
  , path = require('path')
  , osc = require('node-osc')
  , EventEmitter = require('events').EventEmitter

var SuperCollider = module.exports = function(port, host) {
  if (!(this instanceof SuperCollider)) return new SuperCollider(port, host)
  var self = this

  EventEmitter.call(this)
  
  this.port = port || 57110
  this.clientPort = this.clientOriginalPort = this.port + 30
  this.host = host || '127.0.0.1'
  this._nextId = 1000
}

util.inherits(SuperCollider, EventEmitter)

SuperCollider.prototype._createClient = function(port, rr, host) {
  console.log(port, rr, host)
  return new osc.Client(port, rr, host, true)
}

SuperCollider.prototype.roundRobinPort = function() {
  if (this.clientPort > this.clientOriginalPort + 50) this.clientPort = this.clientOriginalPort
  return this.clientPort++
}

SuperCollider.prototype.send = function() {
  var self = this
    , args = [].slice.call(arguments)
    , cb
  if ('function' === typeof args[args.length - 1]) {
    cb = args.pop()
  }
  var scc = this._createClient(this.port, this.roundRobinPort(), this.host)
  cb && scc._sock.once('message', function(message, address) {
    var messageString = message.toString()
    self.emit('message', messageString, address)
    cb(null, messageString, address)
  })
  scc.send.apply(scc, args)  
  return scc
}

// Get next node id
SuperCollider.prototype.nextNodeId = function() {
  return this._nextId++
}

SuperCollider.prototype.Synth = function(synthName, args) {
  var synth = new Synth(this, synthName, args)
  return synth
}

var Synth = function(sc, synthName, args) {
  this.sc = sc
  this.node = sc.nextNodeId()
  this.sc.send.apply(this.sc, ['/s_new', synthName, this.node].concat(args))
  return this
}

Synth.prototype.set = function() {
  this.sc.send.apply(this.sc, ['/n_set', this.node].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.free = function() {
  this.sc.send.call(this.sc, '/n_free', this.node)
  return this
}
