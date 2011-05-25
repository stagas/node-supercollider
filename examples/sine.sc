s = Server.local;
s.boot;

( 
SynthDef("sine", {
    |freq=440, amp=0.1|
	var osc; 
	osc = SinOsc.ar(freq, 0, amp);
	Out.ar(0, osc);
	}).send(s);
) 


(
SynthDef(\RingMod,{
               |freq = 1000|
		var in = [0,1];
		var out = [0,1];
		var ring = SinOsc.kr(freq);

		var	sound = In.ar(in);
		Out.ar(out, sound*ring);
	}).send(s);
)
