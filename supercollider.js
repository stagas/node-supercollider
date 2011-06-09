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

//SuperCollider's API messages,
//in most cases, a function will have the same name as the message
//and it will take the same arguments
//use also Server-Command-Reference from SC manual

//super collider master controls
//to use them do sc.dumpOSC etc..
SuperCollider.prototype.dumpOSC = function(num){
  this.send('/dumpOSC', num)
  return this
}

SuperCollider.prototype.quit = function(){
  this.send('/quit')
  return this
}

SuperCollider.prototype.notify = function(){
  this.send('/notify')
  return this
}

SuperCollider.prototype.status = function(){
  this.send('/quit')
  return this
}

SuperCollider.prototype.synch = function(num){
  this.send('/synch', num)
  return this
}

SuperCollider.prototype.clearSched = function(){
  this.send('/clearSched')
  return this
}

SuperCollider.prototype.status = function(num){
  this.send('/error')
  return this
}

//node messages
Synth.prototype.n_set = function() {
  this.sc.send.apply(this.sc, ['/n_set', this.node].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.n_free = function() {
  this.sc.send.call(this.sc, '/n_free', this.node)
  return this
}

Synth.prototype.n_run = function(flag){
  this.sc.send.apply(this.sc, ['/n_run', this.node, flag,  this.node].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.n_after = function(id){
  this.sc.send.apply(this.sc, ['/n_after',this.node, id,  this.node].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.n_before = function(id){
  this.sc.send.apply(this.sc, ['/n_before',this.node, id,  this.node].concat([].slice.call(arguments)))
  return this
}


//group messages
Synth.prototype.g_tail = function(group){
  this.sc.send.apply(this.sc, ['/g_tail', group || 1, this.node].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.g_head = function(group){
  this.sc.send.apply(this.sc, ['/g_head', group || 1, this.node ].concat([].slice.call(arguments)))
  return this
}

Synth.prototype.g_freeAll = function(group){
  this.sc.send('/g_freeAll', group || 1)
  return this
}

