s = Server.local;
s.boot;

( 
	SynthDef("sine", { arg freq=440, amp=0.1; 
	var osc; 
	osc = SinOsc.ar(freq, 0, amp);
	Out.ar(0, osc);
	}).send(s);
) 